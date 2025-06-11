from __future__ import annotations
import json
import os
from typing import Dict, List, Tuple
from openai import OpenAI
from suggestions import get_component_from_db, validate_set

# from app import create_app
import re
from typing import Dict


# ----- CONFIG -----
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
MODEL = "gpt-4o-mini"

MAX_ITERATIONS = 3  # zabezpieczenie przed pętlą bez końca
TEMPERATURE = 0.15  # bardziej deterministycznie
SYSTEM_MSG = (
    "You are a helpful PC-building assistant. "
    "Return only valid JSON. Component names must be as short as possible, "
    "avoid BOX/OEM unless necessary."
)


# --------------------  OpenAI wrappers  --------------------------------------
def _chat(prompt: str, temperature: float = TEMPERATURE) -> str:
    resp = client.chat.completions.create(
        model=MODEL,
        temperature=temperature,
        messages=[
            {"role": "system", "content": SYSTEM_MSG},
            {"role": "user", "content": prompt},
        ],
    )
    return resp.choices[0].message.content.strip()


# --------------------  Core functions  ---------------------------------------
def extract_json_block(text: str) -> str:
    start = text.find("{")
    if start == -1:
        raise ValueError("No opening brace found in response.")

    brace_count = 0
    for i in range(start, len(text)):
        if text[i] == "{":
            brace_count += 1
        elif text[i] == "}":
            brace_count -= 1

        if brace_count == 0:
            return text[start : i + 1]

    raise ValueError("Braces are unbalanced in the response.")


def get_setups(requirements: str) -> Dict:
    prompt = (
        "You are a JSON API. Respond ONLY with a valid JSON object, nothing else.\n\n"
        "Your task is to generate a dictionary representing three PC builds: 'budget', 'balanced', and 'efficient'.\n"
        "The JSON object must have exactly three top-level keys: 'budget', 'balanced', and 'efficient'.\n"
        "Each of these keys must map to a dictionary with exactly the following keys:\n"
        "cpu, gpu, motherboard, ram, power_supply, case, storage_drive, cpu_cooler, description.\n\n"
        "Use realistic, search-friendly component names suitable for matching against a product database "
        "(e.g. 'AMD Ryzen 5 5600G', 'MSI B550M PRO-VDH').\n"
        "Use discrete GPUs only — do not use integrated graphics.\n"
        "If in requirements parts are given, dont change them, always return them as they were.\n"
        "in 'description' describe choosen setup and why it is a good choice. It should be written in Polish language.\n"
        "Avoid vague terms like 'Mid Tower' or 'Air Cooler'. Use specific model names whenever possible.\n\n"
        "Do NOT include markdown (like ```json), comments, explanations, or any text outside the JSON object.\n\n"
        f"REQUIREMENTS:\n{requirements}"
    )

    raw = _chat(prompt)

    if not raw or not raw.strip():
        raise ValueError("Model returned an empty response.")

    try:
        cleaned = extract_json_block(raw)
        return json.loads(cleaned)
    except (json.JSONDecodeError, ValueError) as e:
        raise ValueError(
            f"Failed to parse JSON from model response.\nRaw response:\n{raw}\nError:\n{e}"
        )


def get_candidates(unfiltered_setups: Dict) -> Tuple[Dict, Dict]:
    """Zwraca tuple (candidates_dict, errors_dict) gdzie errors_dict zawiera listy brakujących części"""
    out = {"budget": {}, "balanced": {}, "efficient": {}}
    errors = {"budget": [], "balanced": [], "efficient": []}

    for tier_key in out.keys():
        for part_type, name in unfiltered_setups[tier_key].items():
            if part_type == "description":
                continue

            matches = get_component_from_db(part_type, name)
            if not matches:  # Brak kandydatów
                errors[tier_key].append({part_type: name})
            else:
                out[tier_key][part_type] = [
                    {"id": m.id, "name": m.name} for m in matches
                ]
    return out, errors


def map_missing_parts_to_errors(missing_parts: Dict) -> List[str]:
    """Konwertuje słownik brakujących części na listę komunikatów błędów"""
    messages = []

    for tier, parts in missing_parts.items():
        if not parts:
            continue
        msg = f"The folowing parts are not in database for '{tier}': " + ", ".join(
            f"{list(p.keys())[0]}: {list(p.values())[0]}" for p in parts
        )
        messages.append(msg)

    return messages


def form_fltered_setup(
    requirements: str, descriptions: Dict, candidates: Dict
) -> Tuple[Dict, Dict]:
    """Zwraca (setup_ids, setup_names) - działa tylko gdy wszystkie części mają kandydatów"""
    setup_ids, setup_names = {}, {}

    for tier, parts in candidates.items():
        setup_ids[tier], setup_names[tier] = {}, {}

        for ptype, cand_list in parts.items():
            if len(cand_list) == 0:
                chosen = {"id": None, "name": ""}
            elif len(cand_list) == 1:
                chosen = cand_list[0]
            else:
                # LLM wybiera z listy ID
                prompt = (
                    f"You are a strict JSON API.\n\n"
                    f"Given these REQUIREMENTS:\n{requirements}\n\n"
                    f"And the following list of candidates for a {ptype} in the {tier} PC build:\n"
                    f"{json.dumps(cand_list, ensure_ascii=False)}\n\n"
                    "Select the best candidate and respond with ONLY this exact format:\n"
                    '{"id": 123}\n'
                    "Do NOT include any explanation, markdown, or comments. Respond with only a single-line JSON object exactly like above."
                )
                resp = _chat(prompt)
                parsed = json.loads(extract_json_block(resp))
                chosen_id = parsed["id"]
                chosen = next(c for c in cand_list if c["id"] == chosen_id)

            setup_ids[tier][ptype] = chosen["id"]
            setup_names[tier][ptype] = chosen["name"]

        setup_names[tier]["description"] = descriptions[tier]["description"]

    return setup_ids, setup_names


def map_code_results_on_strings(results: List[int]) -> List[str]:
    codes = {
        0: "",
        1: "budget exceeded",
        2: "power supply too weak",
        3: "socket mismatch",
        # ...
    }
    return [codes.get(code, "unknown error") for code in results]


def update_requirements(
    requirements: Dict, setup_with_names: Dict, error_strings: Dict
) -> Dict:
    for i, tier in enumerate(["budget", "balanced", "efficient"]):
        if error_strings[i]:
            # „unfreeze” zestaw: usuń go z chosen_parts, zapisz błąd
            requirements[tier]["error"] = error_strings[i]
        else:
            requirements[tier]["error"] = ""
        requirements[tier].update(
            {k: v for k, v in setup_with_names[tier].items() if k != "description"}
        )
    return requirements


# --------------------  Orchestrator  -----------------------------------------
def build_pc_setups(initial_requirements: Dict) -> Dict:
    req_json = json.dumps(initial_requirements, ensure_ascii=False)

    print(req_json)
    unfiltered = get_setups(req_json)
    candidates, missing_parts = get_candidates(unfiltered)

    # Najpierw rozwiązujemy problem brakujących części
    tries = 0
    _, setup_names = form_fltered_setup(req_json, unfiltered, candidates)
    while any(missing_parts.values()) and tries < MAX_ITERATIONS:
        error_strings = map_missing_parts_to_errors(missing_parts)
        initial_requirements = update_requirements(
            initial_requirements, setup_names, error_strings
        )

        req_json = json.dumps(initial_requirements, ensure_ascii=False)
        unfiltered = get_setups(req_json)
        candidates, missing_parts = get_candidates(unfiltered)
        tries += 1

    # TODO
    # if any(missing_parts.values()):
    #     raise RuntimeError(f"Could not find candidates for all parts after {MAX_ITERATIONS} tries")
    setups_ids, setups_names = form_fltered_setup(req_json, unfiltered, candidates)

    tries = 0
    result = [".", ".", "."]  # dummy non-zero start

    while result != ["", "", ""] and tries < MAX_ITERATIONS:
        # pętla przez trzy tier-y:
        result = []
        for tier in ["budget", "balanced", "efficient"]:
            # TODO
            # result_tier = validate_set(json.loads(setups_ids[tier]))
            result_tier = ""
            result.append(result_tier)
        if result == ["", "", ""]:
            break

        result_strings = map_code_results_on_strings(result)
        initial_requirements = update_requirements(
            initial_requirements, setups_names, result_strings
        )
        req_json = json.dumps(initial_requirements, ensure_ascii=False)
        unfiltered = get_setups(req_json)
        candidates, missing_parts = get_candidates(
            unfiltered
        )  # not secured missing missing_parts!!!
        setups_ids, setups_names = form_fltered_setup(req_json, unfiltered, candidates)
        tries += 1

    setups_ids["budget"]["description"] = unfiltered["budget"]["description"]
    setups_ids["balanced"]["description"] = unfiltered["balanced"]["description"]
    setups_ids["efficient"]["description"] = unfiltered["efficient"]["description"]

    print(setups_ids)

    return setups_ids  # lub setups_names, zależnie co potrzebujesz


# -----------------------------  CLI demo  ------------------------------------
if __name__ == "__main__":
    # requirements = {
    #     "purposes": ["games", "software development"],
    #     "price": 4000,
    #     "chosen parts": {
    #         "gpu": "MSI GeForce RTX 3060 Ventus 2X 12G",
    #         "cpu": "Intel Core i5-14600KF",
    #         "motherboard": "",
    #         "ram": "",
    #         "power_supply": "",
    #         "case": "",
    #         "storage_drive": "",
    #         "cpu_cooler": "",
    #         "error": "",
    #     },  # "operating_system": "",
    # }

    requirements = {
        "purposes": ["games", "software development"],
        "price": 5000,
        "budget": {
            "gpu": "MSI GeForce RTX 3060 Ventus 2X 12G",
            "cpu": "Intel Core i5-14600KF",
            "motherboard": "",
            "ram": "",
            "power_supply": "",
            "case": "",
            "storage_drive": "",
            "cpu_cooler": "",
            "error": "",
        },  # "operating_system": "",
        "balanced": {
            "gpu": "MSI GeForce RTX 3060 Ventus 2X 12G",
            "cpu": "Intel Core i5-14600KF",
            "motherboard": "",
            "ram": "",
            "power_supply": "",
            "case": "",
            "storage_drive": "",
            "cpu_cooler": "",
            "error": "",
        },
        "efficient": {
            "gpu": "MSI GeForce RTX 3060 Ventus 2X 12G",
            "cpu": "Intel Core i5-14600KF",
            "motherboard": "",
            "ram": "",
            "power_supply": "",
            "case": "",
            "storage_drive": "",
            "cpu_cooler": "",
            "error": "",
        },
    }

    app = create_app()

    with app.app_context():
        setups = build_pc_setups(requirements)
        print(json.dumps(setups, indent=2, ensure_ascii=False))

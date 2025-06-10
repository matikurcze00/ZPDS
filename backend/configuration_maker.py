from __future__ import annotations
import json
import os
from typing import Dict, List, Tuple
from openai import OpenAI
from suggestions import get_component_from_db, validate_set
from app import create_app
import re
from typing import Dict


# ----- CONFIG -----
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
MODEL = "gpt-4o-mini"          

MAX_ITERATIONS = 3             # zabezpieczenie przed pętlą bez końca
TEMPERATURE = 0.3              # bardziej deterministycznie
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
    start = text.find('{')
    if start == -1:
        raise ValueError("No opening brace found in response.")

    brace_count = 0
    for i in range(start, len(text)):
        if text[i] == '{':
            brace_count += 1
        elif text[i] == '}':
            brace_count -= 1

        if brace_count == 0:
            return text[start:i+1]

    raise ValueError("Braces are unbalanced in the response.")

def get_setups(requirements: str) -> Dict:
    prompt = (
    "Generate a Python-style dictionary with three PC setups: "
    "'Budget', 'Balanced', and 'Efficient'.\n"
    "Each setup must contain exactly these keys: cpu, gpu, motherboard, ram, "
    "power_supply, case, storage_drive, cpu_cooler, description.\n"
    "For each component, return a realistic, search-friendly name as you would find it in an online store or a parts database. "
    "Include manufacturer names or common model names where applicable (e.g. 'AMD Ryzen 5 5600G', 'MSI B550M PRO-VDH').\n"
    "Avoid vague labels like 'Air Cooler' or 'Mid Tower' – prefer specific models if possible.\n"
    "For GPU do not use Integrated graphics.\n"
    "Return ONLY a valid JSON object. DO NOT include any explanation, comments, or formatting like ```json.\n\n"
    f"REQUIREMENTS:\n{requirements}"
)

    raw = _chat(prompt)

    if not raw or not raw.strip():
        raise ValueError("Model returned an empty response.")

    try:
        cleaned = extract_json_block(raw)
        return json.loads(cleaned)
    except (json.JSONDecodeError, ValueError) as e:
        raise ValueError(f"Failed to parse JSON from model response.\nRaw response:\n{raw}\nError:\n{e}")

def get_candidates(unfiltered_setups: Dict) -> Tuple[Dict, Dict]:
    """Zwraca tuple (candidates_dict, errors_dict) gdzie errors_dict zawiera listy brakujących części"""
    out = {"budget": {}, "balanced": {}, "efficient": {}}
    errors = {"budget": [], "balanced": [], "efficient": []}

    chosen_parts_key = None
    for key in ['chosen parts', 'chosen_parts']:
        if key in unfiltered_setups:
            chosen_parts_key = key
            break
            
    for tier_key in out.keys():
        for part_type, name in unfiltered_setups[chosen_parts_key][tier_key].items(): #TODO chosen parts or chosen_parts
            if part_type == "description":
                continue
                
            matches = get_component_from_db(part_type, name)
            if not matches:  # Brak kandydatów
                errors[tier_key].append({part_type: name})
            else:
                out[tier_key][part_type] = [{"id": m.id, "name": m.name} for m in matches]                
    return out, errors

def map_missing_parts_to_errors(missing_parts: Dict) -> Dict:
    """Konwertuje słownik brakujących części na komunikaty błędów"""
    return {
        tier: f"The folowing parts are not in database. Try another: {', '.join(f'{list(p.keys())[0]}: {list(p.values())[0]}' for p in parts)}" 
        if parts else ""
        for tier, parts in missing_parts.items()
    }

def form_full_setup(
    requirements: str,
    descriptions: Dict,
    candidates: Dict
) -> Tuple[Dict, Dict]:
    """Zwraca (setup_ids, setup_names) - działa tylko gdy wszystkie części mają kandydatów"""
    setup_ids, setup_names = {}, {}

    for tier, parts in candidates.items():
        setup_ids[tier], setup_names[tier] = {}, {}
        
        for ptype, cand_list in parts.items():
            if len(cand_list) == 1:
                chosen = cand_list[0]
            else:
                # LLM wybiera z listy ID
                prompt = (
                    f"Based on these REQUIREMENTS:\n{requirements}\n\n"
                    f"Select the best {ptype} for {tier} PC build from these candidates. "
                    "Return JSON with single 'id' key holding the chosen candidate id.\n"
                    f"CANDIDATES:\n{json.dumps(cand_list, ensure_ascii=False)}"
                )
                resp = _chat(prompt)
                chosen_id = json.loads(resp)["id"]
                chosen = next(c for c in cand_list if c["id"] == chosen_id)

            setup_ids[tier][ptype] = chosen["id"]
            setup_names[tier][ptype] = chosen["name"]

        setup_names[tier]["description"] = descriptions[tier.capitalize()]["description"]

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
    requirements: Dict,
    setup_with_names: Dict,
    error_strings: List[str]
) -> Dict:
    for i, tier in enumerate(["budget", "balanced", "efficient"]):
        if error_strings[i]:
            # „unfreeze” zestaw: usuń go z chosen_parts, zapisz błąd
            requirements["chosen parts"][tier]["error"] = error_strings[i]
        else:
            # zamroź poprawny
            requirements["chosen parts"][tier].update(
                {k: v for k, v in setup_with_names[tier].items() if k != "description"}
            )
            requirements["chosen parts"][tier]["error"] = ""
    return requirements

# --------------------  Orchestrator  -----------------------------------------
def build_pc_setups(initial_requirements: Dict) -> Dict:
    req_json = json.dumps(initial_requirements, ensure_ascii=False)
    unfiltered = get_setups(req_json)
    candidates, missing_parts = get_candidates(unfiltered)
    
    # Najpierw rozwiązujemy problem brakujących części
    tries = 0
    form_full_setup(req_json, unfiltered, candidates)
    while any(missing_parts.values()) and tries < MAX_ITERATIONS:
        error_strings = map_missing_parts_to_errors(missing_parts)
        initial_requirements = update_requirements(
            initial_requirements, 
            {},  # brak pełnych setupów - tylko error
            error_strings
        )
        
        req_json = json.dumps(initial_requirements, ensure_ascii=False)
        unfiltered = get_setups(req_json)
        candidates, missing_parts = get_candidates(unfiltered)
        tries += 1
    
    if any(missing_parts.values()):
        raise RuntimeError(f"Could not find candidates for all parts after {MAX_ITERATIONS} tries")
    setups_ids, setups_names = form_full_setup(req_json, unfiltered, candidates)

    tries = 0
    result = [1, 1, 1]  # dummy non-zero start

    while result != [0, 0, 0] and tries < MAX_ITERATIONS:
        # pętla przez trzy tier-y:
        result = []
        for tier in ["budget", "balanced", "efficient"]:
            result_tier = validate_set(json.loads(setups_ids[tier]))
            result.append(result_tier)
        if result == [0, 0, 0]:
            break

        result_strings = map_code_results_on_strings(result)
        initial_requirements = update_requirements(
            initial_requirements, setups_names, result_strings
        )
        req_json = json.dumps(initial_requirements, ensure_ascii=False)
        unfiltered = get_setups(req_json)
        candidates, missing_parts = get_candidates(unfiltered) # not secured missing missing_parts!!!        
        setups_ids, setups_names = form_full_setup(req_json, unfiltered, candidates)
        tries += 1

    return setups_ids  # lub setups_names, zależnie co potrzebujesz

# -----------------------------  CLI demo  ------------------------------------
if __name__ == "__main__":
    # ✂️  Wstaw tu prawdziwe wymagania użytkownika    
    requirements = {
        "purposes": ["games", "software development"],
        "price": 5000,
        "chosen parts": {
            "budget": {"gpu": "", "cpu": "","motherboard": "", "ram": "", "power_supply": "", "case": "", "storage_drive": "", "cpu_cooler": "", "error": ""}, #"operating_system": "",  
            "balanced": {"gpu": "", "cpu": "","motherboard": "", "ram": "", "power_supply": "", "case": "", "storage_drive": "", "cpu_cooler": "",  "error": ""},
            "efficient": {"gpu": "", "cpu": "","motherboard": "", "ram": "", "power_supply": "", "case": "", "storage_drive": "", "cpu_cooler": "",  "error": ""},
        },
    }
    app = create_app()

    with app.app_context():
        setups = build_pc_setups(requirements)
        print(json.dumps(setups, indent=2, ensure_ascii=False))


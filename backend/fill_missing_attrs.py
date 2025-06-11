import json, os, time, shutil, logging
from pathlib import Path
from typing import List, Dict
import backoff
import openai
import tiktoken
from json import JSONDecodeError


# ─────────────────────────────
#  KONFIGURACJA
# ─────────────────────────────
openai.api_key = os.getenv("OPENAI_API_KEY")

MODEL                = "gpt-4.1-mini"           # albo gpt-4.1-base / nano
MAX_NAMES_PER_CHUNK  = 200                      # mini=200 | base=400 | nano=100
MAX_TOKENS_RESPONSE  = 4096                     # mini=4k | base=8k | nano=2k
MAX_RETRIES          = 5
TEMPERATURE          = 0.6

DATASET_FILE = Path("./backend/dataset.json")
BACKUP_FILE  = DATASET_FILE.with_suffix(".json.bak")

PART_TYPES = ["cpu", "cpu-cooler", "gpu", "ram", "motherboard", "case"]
NEED: Dict[str, str] = {
    "cpu":          "socket",
    "cpu-cooler":   "socket",
    "gpu":          "wattage",
    "ram":          "memory_type",
    "motherboard":  "supported_memory_type_and_number_of_m2_slots",
    "case":         "max_gpu_length_mm",
}

# ─────────────────────────────
#  TOKENIZER (fallback, gdy alias nieznany)
# ─────────────────────────────
try:
    enc = tiktoken.encoding_for_model(MODEL)
except KeyError:
    enc = tiktoken.get_encoding("cl100k_base")

def toks(s: str) -> int:
    return len(enc.encode(s))


def make_chunks(names: List[str]):
    """Dzieli listę na paczki po MAX_NAMES_PER_CHUNK nazw."""
    for i in range(0, len(names), MAX_NAMES_PER_CHUNK):
        yield names[i : i + MAX_NAMES_PER_CHUNK]


SYSTEM_MSG = (
    "You are a data-extraction assistant. "
    "Return one JSON object whose keys are exactly the provided part names "
    "and whose values are the requested attribute. "
    "If unknown, return null. No other keys, no comments."
)

@backoff.on_exception(
    backoff.expo,
    (openai.RateLimitError, openai.APIError),
    max_tries=MAX_RETRIES,
    jitter=backoff.full_jitter,
)
def ask_llm(part_type: str, attribute: str, names: List[str]) -> Dict[str, str]:
    """Jednorazowe wywołanie LLM – zwraca dict{name: value}."""
    rsp = openai.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_MSG},
            {"role": "user",   "content": json.dumps({
                "part_type": part_type,
                "attribute": attribute,
                "names": names
            }, ensure_ascii=False)}
        ],
        response_format={"type": "json_object"},
        max_tokens=MAX_TOKENS_RESPONSE,
        temperature=TEMPERATURE
    )
    return json.loads(rsp.choices[0].message.content)


def safe_ask_llm(part_type: str, attribute: str, names: List[str]) -> Dict[str, str]:
    """
    Wywołuje LLM z automatycznym dzieleniem chunku przy błędnym / obciętym JSON-ie.
    """
    if not names:
        return {}
    try:
        return ask_llm(part_type, attribute, names)
    except (JSONDecodeError, ValueError):
        # jeśli paczka ma jedną nazwę, zwróć null i loguj
        if len(names) == 1:
            logging.warning(f"{part_type}: JSON error dla '{names[0]}' – zapisano null")
            return {names[0]: None}
        mid = len(names) // 2
        left  = safe_ask_llm(part_type, attribute, names[:mid])
        right = safe_ask_llm(part_type, attribute, names[mid:])
        left.update(right)
        return left


def process_category(parts: List[Dict], part_type: str) -> int:
    attr = NEED[part_type]
    total = len(parts)
    todo  = [p["name"] for p in parts if attr not in p or p[attr] in ("", None)]

    logging.info(f"{part_type:<13} | w pliku: {total:5d} | brakujących: {len(todo):5d}")
    if not todo:
        return 0

    filled = 0
    for chunk in make_chunks(todo):
        mapping = safe_ask_llm(part_type, attr, chunk)
        for p in parts:
            name = p["name"]
            if name in mapping and mapping[name] not in (None, "", "null"):
                if p.get(attr) in ("", None):
                    filled += 1
                p[attr] = mapping[name]

    logging.info(f"{part_type:<13} | uzupełniono: {filled:5d}")
    return filled


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(message)s")

    if not DATASET_FILE.exists():
        raise SystemExit(f"Brak pliku {DATASET_FILE}")

    shutil.copy2(DATASET_FILE, BACKUP_FILE)
    logging.info(f"Backup zapisany jako {BACKUP_FILE}")

    data = json.loads(DATASET_FILE.read_text(encoding="utf-8"))

    start = time.time()
    total_filled = 0

    for ptype in PART_TYPES:
        parts = data.get(ptype, [])
        total_filled += process_category(parts, ptype)

    DATASET_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    logging.info(f"Zakończono: uzupełniono {total_filled} wartości w {time.time()-start:.1f}s")
    logging.info(f"Plik nadpisany: {DATASET_FILE} (backup w {BACKUP_FILE})")


if __name__ == "__main__":
    main()

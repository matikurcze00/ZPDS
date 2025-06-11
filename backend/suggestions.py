from models import *
from rapidfuzz import fuzz

component_map = {
    "cpu": CPU,
    "gpu": GPU,
    "motherboard": Motherboard,
    "ram": RAM,
    "power_supply": PowerSupply,
    "case": Case,
    "storage_drive": StorageDrive,
    "cpu_cooler": CPUCooler,
}


def get_component_from_db(comp_type, component_name):
    """
    Fetch a component from the database by type and component name.
    """
    comp_class = component_map.get(comp_type)
    if not comp_class:
        print(f"get_component_from_db -> Invalid component type: {comp_type}")
        return []

    matching_components = []
    component_name = str.upper(component_name)
    components = comp_class.query.all()

    for comp in components:
        ratio = fuzz.token_set_ratio(str.upper(comp.name), component_name)
        if ratio > 90:
            matching_components.append(comp)

    return matching_components


def validate_set(component_ids):
    """
    Check if the provided component IDs can create valid pc build.
    return errors list<int> eg. [2, 5, 6, 7]
    empty list means set is valid
    """
    cpu = CPU.query.get(component_ids.get("cpu"))
    gpu = GPU.query.get(component_ids.get("gpu"))
    motherboard = Motherboard.query.get(component_ids.get("motherboard"))
    ram = RAM.query.get(component_ids.get("ram"))
    power_supply = PowerSupply.query.get(component_ids.get("power_supply"))
    case = Case.query.get(component_ids.get("case"))
    storage_drive = StorageDrive.query.get(component_ids.get("storage_drive"))
    cpu_cooler = CPUCooler.query.get(component_ids.get("cpu_cooler"))
    if (
        not cpu
        or not gpu
        or not motherboard
        or not ram
        or not power_supply
        or not case
        or not storage_drive
        or not cpu_cooler
    ):
        print(f"validate_set -> Invalid components {component_ids}")
        return False

    errors = ""
    if not cpu.is_compatible(motherboard):
        print(
            f"validate_set -> CPU {cpu.name} is not compatible with motherboard {motherboard.name}"
        )
        errors += "1"
    if not ram.is_compatible(motherboard):
        print(
            f"validate_set -> RAM {ram.name} is not compatible with motherboard {motherboard.name}"
        )
        errors += "2"
    if not cpu_cooler.is_compatible(motherboard):
        print(
            f"validate_set -> CPU Cooler {cpu_cooler.name} is not compatible with CPU {cpu.name}"
        )
        errors += "3"
    if not gpu.fits(case):
        print(f"validate_set -> GPU {gpu.name} does not fit in case {case.name}")
        errors += "4"
    if motherboard.fits_in(case):
        print(
            f"validate_set -> Motherboard {motherboard.name} does not fit in case {case.name}"
        )
        errors += "5"
    if not storage_drive.is_compatible(motherboard):
        print(
            f"validate_set -> Storage Drive {storage_drive.name} is not compatible with motherboard {motherboard.name}"
        )
        errors += "6"
    if not power_supply.is_capable(motherboard, gpu, cpu):
        print(
            f"validate_set -> Power Supply {power_supply.name} is not capable of powering the components"
        )
        errors += "7"

    return errors

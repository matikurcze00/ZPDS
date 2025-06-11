from flask import Blueprint, request, jsonify, make_response
from models import *
from database import db
from suggestions import get_component_from_db, validate_set
from configuration_maker import build_pc_setups
import copy
import time
import random
from sqlalchemy import distinct

api_bp = Blueprint("api_bp", __name__, url_prefix="/")

DOLLAR_TO_PLN = 3.72  # Example conversion rate, adjust as needed
# DOLLAR_TO_PLN = 5.1
from tmp.mockup import mockups

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


@api_bp.route("/getComponents", methods=["GET"])
def get_components():
    all_components = []
    for comp_type, comp_class in component_map.items():
        # Get all components but ensure unique names by using first() for each distinct name
        unique_components = []
        seen_names = set()

        for component in comp_class.query.order_by(comp_class.id).all():
            if component.name not in seen_names:
                seen_names.add(component.name)
                unique_components.append(component)

        all_components.append(
            {"name": comp_type, "models": [c.to_json() for c in unique_components]}
        )

    return jsonify(all_components)


@api_bp.route("/getSuggestions", methods=["POST"])
def get_suggestions():
    data = request.get_json()
    price = data.get("price", 0)
    purposes = data.get("purposes", [])
    selected = copy.deepcopy(data.get("components", {}))
    print("selected na początku: ", selected)

    requirements = {
        "purposes": purposes,
        "price": price,
        "budget": data.get("components", {}),
        "balanced": data.get("components", {}),
        "efficient": data.get("components", {}),
    }

    map_suggestions = {0: "budget", 1: "balanced", 2: "efficient"}

    recomendations = build_pc_setups(requirements)

    # recomendations = {
    #     "budget": {
    #         "cpu": 4,
    #         "motherboard": 20,
    #         "power_supply": 533,
    #         "case": 7,
    #         "cpu_cooler": 11,
    #         "description": "Ten zestaw to świetny wybór dla graczy i osób pracujących biurowo. Procesor Ryzen 5 5600G zapewnia dobrą wydajność, a karta GTX 1650 pozwala na granie w wiele gier w rozdzielczości 1080p. Zestaw jest również dobrze zbalansowany pod względem ceny i wydajności.",
    #     },
    #     "balanced": {
    #         "cpu": 19,
    #         "motherboard": 248,
    #         "power_supply": 20,
    #         "case": 84,
    #         "storage_drive": 19,
    #         "cpu_cooler": 155,
    #         "description": "Zestaw ten oferuje doskonałą równowagę między wydajnością a ceną. Ryzen 7 5800X w połączeniu z RTX 3060 zapewnia świetne osiągi w grach oraz w pracy wielozadaniowej. Dodatkowo, szybki dysk NVMe przyspiesza ładowanie systemu i aplikacji.",
    #     },
    #     "efficient": {
    #         "cpu": 4,
    #         "motherboard": 66,
    #         "case": 208,
    #         "storage_drive": 3,
    #         "cpu_cooler": 27,
    #         "description": "Ten zestaw jest idealny dla osób szukających efektywności i wydajności w grach oraz pracy. Procesor Ryzen 5 5600X w połączeniu z RTX 3050 zapewnia płynne działanie w grach oraz dobrą wydajność w aplikacjach biurowych. Dodatkowo, szybki dysk NVMe przyspiesza wszystkie operacje.",
    #     },
    # }

    # Create three variations of suggestions
    suggestions = []
    base_names = ["Budżetowa", "Zbalansowana", "Wydajna"]

    for i in range(3):
        components_dict = {}
        total_price = 0
        print("recomended", recomendations[map_suggestions[i]])
        print("selected ", selected)
        # Get components for this suggestion
        for comp_type, comp_class in component_map.items():
            print(comp_type)
            if comp_type in selected and selected[comp_type]:
                print("selected")
                # Use selected component if provided
                component = comp_class.query.get(selected[comp_type])
                if component:
                    components_dict[comp_type] = {
                        "id": component.id,
                        "name": component.name,
                        "price": round(component.price * DOLLAR_TO_PLN, 2),
                        "description": component.get_description(),
                        "link": f"https://example.com/{comp_type}/{component.id}",  # Placeholder link
                    }
                    total_price += component.price * DOLLAR_TO_PLN
            elif comp_type in recomendations[map_suggestions[i]]:
                print("recomended")
                component = comp_class.query.get(
                    recomendations[map_suggestions[i]][comp_type]
                )
                if component:
                    components_dict[comp_type] = {
                        "id": component.id,
                        "name": component.name,
                        "price": round(component.price * DOLLAR_TO_PLN, 2),
                        "description": component.get_description(),
                        "link": f"https://example.com/{comp_type}/{component.id}",  # Placeholder link
                    }
                    total_price += component.price * DOLLAR_TO_PLN
            else:
                print("else")
                if recomendations[map_suggestions[i]].get(comp_type, None):
                    component = comp_class.query.get(
                        recomendations[map_suggestions[i]][comp_type]
                    )
                    if component:
                        components_dict[comp_type] = {
                            "id": component.id,
                            "name": component.name,
                            "price": round(component.price * DOLLAR_TO_PLN, 2),
                            "description": component.get_description(),
                            "link": f"https://example.com/{comp_type}/{component.id}",  # Placeholder link
                        }
                        total_price += component.price * DOLLAR_TO_PLN

        # total_price = round(total_price * price_multipliers[i], 2)
        total_price = round(total_price, 2)
        description = recomendations[map_suggestions[i]]["description"]

        # Create suggestion object
        suggestion = {
            "name": f"Konfiguracja {base_names[i]}",
            "description": description,
            "price": int(total_price),
            "category": "gaming" if "Gry" in purposes else "office",
            "components": components_dict,
            "comment": f"Ta konfiguracja została zoptymalizowana pod kątem {', '.join(purposes)}. "
            f"Całkowity koszt zestawu wynosi {int(total_price)} PLN.",
        }
        suggestions.append(suggestion)

    response = jsonify(suggestions)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@api_bp.route("/getCpus", methods=["GET"])
def get_cpus():
    all_cpus = CPU.query.all()
    return jsonify([c.to_json() for c in all_cpus])


@api_bp.route("/getGpus", methods=["GET"])
def get_gpus():
    all_gpus = GPU.query.where(
        GPU.price > 300
    ).all()  # Example filter for GPUs under 4000 PLN
    return jsonify([c.to_json() for c in all_gpus])


@api_bp.route("/getComponent", methods=["POST"])
def get_component():
    data = request.get_json()
    return jsonify(
        [
            c.to_json()
            for c in get_component_from_db(
                data.get("component_type", ""), data.get("component_name", "")
            )
        ]
    )


@api_bp.route("/validate", methods=["POST"])
def validate():
    data = request.get_json()
    return jsonify(validate_set(data.get("components", {})))

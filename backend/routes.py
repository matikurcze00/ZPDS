from flask import Blueprint, request, jsonify, make_response
from models import *
from database import db
from suggestions import get_component_from_db, validate_set
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
    selected = data.get("components", {})

    # Create three variations of suggestions
    suggestions = []
    base_names = ["Budżetowa", "Zbalansowana", "Wydajna"]
    base_descriptions = [
        "Ekonomiczna konfiguracja zapewniająca podstawową wydajność",
        "Zbalansowana konfiguracja oferująca dobry stosunek ceny do wydajności",
        "Wysokowydajna konfiguracja dla najbardziej wymagających",
    ]
    price_multipliers = [0.8, 1.0, 1.2]  # Different price points for each suggestion

    time.sleep(2.5)

    if price == 8000:
        shift = 0
    elif price == 3500:
        shift = 3
    elif price == 9000:
        shift = 6
    else:
        shift = -1

    for i in range(3):
        components_dict = {}
        total_price = 0

        # Get components for this suggestion
        for comp_type, comp_class in component_map.items():
            if comp_type in selected and selected[comp_type]:
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
            else:
                # Get a random component
                if shift >= 0:
                    component = comp_class.query.get(mockups[i + shift][comp_type])
                else:
                    component = comp_class.query.order_by(db.func.random()).first()
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
        if shift >= 0:
            description = mockups[i + shift]["description"]
        else:
            description = base_descriptions[i]
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

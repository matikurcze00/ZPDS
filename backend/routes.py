from flask import Blueprint, request, jsonify, make_response
from models import *
from database import db
import random
from sqlalchemy import distinct

api_bp = Blueprint("api_bp", __name__, url_prefix="/")

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
                        "price": component.price,
                        "description": component.get_description(),
                        "link": f"https://example.com/{comp_type}/{component.id}",  # Placeholder link
                    }
                    total_price += component.price
            else:
                # Get a random component
                component = comp_class.query.order_by(db.func.random()).first()
                if component:
                    components_dict[comp_type] = {
                        "id": component.id,
                        "name": component.name,
                        "price": component.price,
                        "description": component.get_description(),
                        "link": f"https://example.com/{comp_type}/{component.id}",  # Placeholder link
                    }
                    total_price += component.price

        # Create suggestion object
        suggestion = {
            "name": f"Konfiguracja {base_names[i]}",
            "description": base_descriptions[i],
            "price": int(total_price * price_multipliers[i]),
            "category": "gaming" if "Gry" in purposes else "office",
            "components": components_dict,
            "comment": f"Ta konfiguracja została zoptymalizowana pod kątem {', '.join(purposes)}. "
            f"Całkowity koszt zestawu wynosi {int(total_price * price_multipliers[i])} PLN.",
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
    all_gpus = GPU.query.all()
    return jsonify([c.to_json() for c in all_gpus])

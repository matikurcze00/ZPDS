from flask import Blueprint, request, jsonify, make_response
from models import *
from database import db
import random

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
    # all_components = {}
    # for comp_type, comp_class in component_map.items():
    #     all_components[comp_type] = [c.to_json() for c in comp_class.query.all()]

    all_components = []
    for comp_type, comp_class in component_map.items():
        all_components.append(
            {"name": comp_type, "models": [c.to_json() for c in comp_class.query.all()]}
        )

    return jsonify(all_components)


@api_bp.route("/getSuggestions", methods=["POST"])
def get_suggestions():
    req = request.get_json()
    selected = req.get("components", {})
    price = req.get("price", None)
    purposes = req.get("purposes", [])

    components = {}

    for comp_type, comp_class in component_map.items():
        selected_id = selected.get(comp_type)
        if selected_id:
            # If already selected, return that component
            obj = comp_class.query.get(selected_id)
            components[comp_type] = obj.to_json() if obj else None
        else:
            # If not selected, pick a random one from DB
            all_objs = comp_class.query.all()
            if all_objs:
                obj = random.choice(all_objs)
                components[comp_type] = obj.to_json()
            else:
                components[comp_type] = None

    components_price = round(
        sum(comp.get("price", 0) for comp in components.values() if comp is not None), 2
    )
    comment = f"Zajebisty zestaw do {str(purposes)}. Czat poleca!"

    return jsonify(
        {
            "components": components,
            "comment": comment,
            "price": components_price,
        }
    )


@api_bp.route("/getCpus", methods=["GET"])
def get_cpus():
    all_cpus = CPU.query.all()
    return jsonify([c.to_json() for c in all_cpus])


@api_bp.route("/getGpus", methods=["GET"])
def get_gpus():
    all_gpus = GPU.query.all()
    return jsonify([c.to_json() for c in all_gpus])

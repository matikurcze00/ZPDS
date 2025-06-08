from flask import Blueprint, request, jsonify, make_response
from models import *
from database import db

api_bp = Blueprint("api_bp", __name__, url_prefix="/")


@api_bp.route("/getComponents", methods=["GET"])
def get_components():
    all_components = {
        "cpu": [c.to_json() for c in CPU.query.all()],
        "gpu": [c.to_json() for c in GPU.query.all()],
        "motherboard": [c.to_json() for c in Motherboard.query.all()],
        "ram": [c.to_json() for c in RAM.query.all()],
        "power_supply": [c.to_json() for c in PowerSupply.query.all()],
        "case": [c.to_json() for c in Case.query.all()],
        "storage_drive": [c.to_json() for c in StorageDrive.query.all()],
        "cpu_Cooler": [c.to_json() for c in CPUCooler.query.all()],
    }
    return jsonify(all_components)


@api_bp.route("/getSuggestions/<int:parameter>", methods=["POST"])
def get_suggestions(parameter):
    return jsonify(
        f"This is a placeholder for the getSuggestions endpoint. parameter={parameter}"
    )


@api_bp.route("/getCpus", methods=["GET"])
def get_cpus():
    all_cpus = CPU.query.all()
    return jsonify([c.to_json() for c in all_cpus])


@api_bp.route("/getGpus", methods=["GET"])
def get_gpus():
    all_gpus = GPU.query.all()
    return jsonify([c.to_json() for c in all_gpus])

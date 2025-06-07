from flask import Blueprint, request, jsonify, make_response
from models import *
from database import db

api_bp = Blueprint("api_bp", __name__, url_prefix="/")


@api_bp.route("/getComponents", methods=["GET"])
def get_components():
    all_components = {
        "cpu": CPU.query.all(),
        "gpu": GPU.query.all(),
        "motherboard": Motherboard.query.all(),
        "ram": RAM.query.all(),
        "power_supply": PowerSupply.query.all(),
        "case": Case.query.all(),
        "storage_drive": StorageDrive.query.all(),
        "cpu_Cooler": CPUCooler.query.all(),
    }
    return jsonify(all_components)


@api_bp.route("/getSuggestions/<int:parameter>", methods=["GET"])
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

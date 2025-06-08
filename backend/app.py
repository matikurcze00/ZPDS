from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import urllib.parse
import json
import os

from models import *
from routes import api_bp
from database import db

parts_to_load = [
    ("cpu", CPU),
    ("cpu-cooler", CPUCooler),
    ("video-card", GPU),
    ("motherboard", Motherboard),
    ("memory", RAM),
    ("power-supply", PowerSupply),
    ("case", Case),
    ("internal-hard-drive", StorageDrive),
]


def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydata.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = app
    db.init_app(app)

    app.register_blueprint(api_bp)

    with app.app_context():
        db.create_all()
        
        # Only load data if the database is empty (no CPUs exist)
        if not CPU.query.first():
            print("Loading initial data into database...")
            with open("backend/dataset.json", "r") as f:
                data = json.load(f)

            for part_type, part_class in parts_to_load:
                for entry in data[part_type]:
                    entity = part_class.from_dict(entry)
                    db.session.add(entity)

            db.session.commit()
            print("Data has been loaded into the database.")
        else:
            print("Database already contains data, skipping initial load.")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="127.0.0.1", port=8000, debug=True)

    @app.route("/")
    def home():
        return "Hello World!!!"

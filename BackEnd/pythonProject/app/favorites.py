# app/favorites.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

favorites_bp = Blueprint("favorites", __name__)

# simple in-memory store: { username: [city1, city2, …] }
favorites_db = {}

@favorites_bp.route("/favorites", methods=["GET"])
@jwt_required()
def get_favorites():
    user = get_jwt_identity()
    return jsonify({"favorites": favorites_db.get(user, [])}), 200

@favorites_bp.route("/favorites", methods=["POST"])
@jwt_required()
def add_favorite():
    user = get_jwt_identity()
    data = request.get_json() or {}
    city = data.get("city", "").strip()
    if not city:
        return jsonify({"error": "Missing city"}), 400

    lst = favorites_db.setdefault(user, [])
    if city not in lst:
        lst.append(city)
    return jsonify({"favorites": lst}), 201

@favorites_bp.route("/favorites/<string:city>", methods=["DELETE"])
@jwt_required()
def remove_favorite(city):
    user = get_jwt_identity()
    lst = favorites_db.get(user, [])
    if city in lst:
        lst.remove(city)
    return jsonify({"favorites": lst}), 200

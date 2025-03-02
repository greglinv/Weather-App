from flask import Blueprint, request, jsonify
import bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import db, User

auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "username and password required"}), 400

    username = data["username"].lower().strip()
    password = data["password"]

    # Check if user already exists
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "User already exists"}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Create new User with default "celsius" preference
    new_user = User(
        username=username,
        password=hashed_password.decode('utf-8'),
        unit_preference="celsius"  # <-- new
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": f"User {username} registered successfully"}), 201


@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "username and password required"}), 400

    username = data["username"].lower().strip()
    password = data["password"]

    user = User.query.filter_by(username=username).first()
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({"error": "Invalid username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify({"access_token": access_token}), 200


@auth.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({"message": f"Hello, {current_user}! You have accessed a protected route."}), 200

@auth.route("/preference", methods=["PATCH"])
@jwt_required()
def update_preference():
    current_user = get_jwt_identity()
    data = request.get_json()

    if not data or "unit_preference" not in data:
        return jsonify({"error": "unit_preference field is required"}), 400

    new_pref = data["unit_preference"].lower()
    if new_pref not in ["celsius", "fahrenheit"]:
        return jsonify({"error": "Invalid preference"}), 400

    user = User.query.filter_by(username=current_user).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.unit_preference = new_pref
    db.session.commit()

    return jsonify({"message": f"Preference updated to {new_pref}"}), 200


@auth.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user = get_jwt_identity()  # This is the username
    user = User.query.filter_by(username=current_user).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "username": user.username,
        "unit_preference": user.unit_preference
    }), 200
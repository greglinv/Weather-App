from flask import Blueprint, request, jsonify
from passlib.hash import bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, get_jwt_identity,
    jwt_required
)

auth = Blueprint("auth", __name__)

# In-memory "user database" for example only
# In production, use a real database (e.g., SQLite, Postgres, etc.)
users_db = {}

@auth.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "username and password required"}), 400

    username = data["username"].lower().strip()
    password = data["password"]

    if username in users_db:
        return jsonify({"error": "User already exists"}), 400

    # Hash the password
    hashed_password = bcrypt.hash(password)
    users_db[username] = hashed_password

    return jsonify({"message": f"User {username} registered successfully"}), 201

@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "username and password required"}), 400

    username = data["username"].lower().strip()
    password = data["password"]

    # Check if user exists
    if username not in users_db:
        return jsonify({"error": "Invalid username or password"}), 401

    hashed_password = users_db[username]

    # Verify password
    if not bcrypt.verify(password, hashed_password):
        return jsonify({"error": "Invalid username or password"}), 401

    # Create JWT
    access_token = create_access_token(identity=username)
    return jsonify({"access_token": access_token}), 200

@auth.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({"message": f"Hello, {current_user}! You have accessed a protected route."}), 200

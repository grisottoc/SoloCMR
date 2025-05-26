from flask import Blueprint, request, jsonify
from models import db, User, Client
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import NotificationSetting

api = Blueprint('api', __name__)

@api.route("/api/register", methods=["POST"])
def register():
    data = request.json
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"msg": "Email already registered"}), 400

    user = User(email=data["email"])
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User registered"}), 200

@api.route("/api/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if not user or not user.check_password(data["password"]):
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token, "user_id": user.id}), 200

@api.route("/api/clients", methods=["GET"])
@jwt_required()
def get_clients():
    user_id = get_jwt_identity()
    clients = Client.query.filter_by(user_id=user_id).all()
    return jsonify([{ "id": c.id, "name": c.name, "email": c.email, "service": c.service, "notes": c.notes, "due_date": c.due_date } for c in clients]), 200

@api.route("/api/client", methods=["POST"])
@jwt_required()
def add_client():
    user_id = get_jwt_identity()
    data = request.get_json()

    required_fields = ["name", "email", "service", "notes", "due_date"]
    for field in required_fields:
        if field not in data:
            return jsonify({"msg": f"{field} is missing"}), 400
        if not isinstance(data[field], str):
            return jsonify({"msg": f"{field} must be a string"}), 422

    try:
        client = Client(
            user_id=user_id,
            name=data["name"],
            email=data["email"],
            service=data["service"],
            notes=data["notes"],
            due_date=data["due_date"]
        )
        db.session.add(client)
        db.session.commit()
        return jsonify({"msg": "Client added"}), 201
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

@api.route("/api/client/<int:id>", methods=["GET"])
@jwt_required()
def get_client(id):
    user_id = get_jwt_identity()
    client = Client.query.filter_by(id=id, user_id=user_id).first()
    if not client:
        return jsonify({"msg": "Client not found"}), 404
    return jsonify({ "id": client.id, "name": client.name, "email": client.email, "service": client.service, "notes": client.notes, "due_date": client.due_date }), 200

@api.route("/api/client/<int:id>", methods=["PUT"])
@jwt_required()
def update_client(id):
    user_id = get_jwt_identity()
    client = Client.query.filter_by(id=id, user_id=user_id).first()
    if not client:
        return jsonify({"msg": "Client not found"}), 404

    data = request.get_json()
    for field in ["name", "email", "service", "notes", "due_date"]:
        if field in data:
            setattr(client, field, data[field])

    db.session.commit()
    return jsonify({"msg": "Client updated"}), 200

@api.route("/api/client/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_client(id):
    user_id = get_jwt_identity()
    client = Client.query.filter_by(id=id, user_id=user_id).first()
    if not client:
        return jsonify({"msg": "Client not found"}), 404

    db.session.delete(client)
    db.session.commit()
    return jsonify({"msg": "Client deleted"}), 200

@api.route("/api/notification-settings", methods=["GET", "PUT"])
@jwt_required()
def notification_settings():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if request.method == "GET":
        setting = user.notification_settings
        if not setting:
            return jsonify({"msg": "No settings found"}), 404
        return jsonify({
            "custom_days_before": setting.custom_days_before,
            "snoozed_ids": setting.snoozed_ids,
            "completed_ids": setting.completed_ids
        })

    elif request.method == "PUT":
        data = request.get_json()
        setting = user.notification_settings or NotificationSetting(user_id=user.id)
        setting.custom_days_before = data.get("custom_days_before", "1,2,3")
        setting.snoozed_ids = data.get("snoozed_ids", "")
        setting.completed_ids = data.get("completed_ids", "")
        db.session.add(setting)
        db.session.commit()
        return jsonify({"msg": "Notification settings updated"})

@api.route("/api/dev/users")
def get_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "email": u.email} for u in users])

@api.route("/api/dev/clients")
def get_all_clients():
    clients = Client.query.all()
    return jsonify([
        {
            "id": c.id,
            "user_id": c.user_id,
            "name": c.name,
            "email": c.email,
            "service": c.service,
            "notes": c.notes,
            "due_date": c.due_date
        }
        for c in clients
    ])

@api.route("/")
def index():
    return "\u2705 Flask backend is running!"

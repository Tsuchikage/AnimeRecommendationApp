def serialize_user(user) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"]
    }

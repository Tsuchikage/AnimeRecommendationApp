from pymongo.database import Database
from serializers import serialize_user
from models import UserAuth
from utils import get_hashed_password
from bson import ObjectId

async def get_user_by_id(db: Database, id: str):
    user = await db.users.find_one({"_id": ObjectId(id)})
    if user:
        return serialize_user(user)


async def get_user_by_username(db: Database, username: str):
    user = await db.users.find_one({"username": username})
    if user:
        return serialize_user(user)
    return None


async def auth_user(db: Database, username: str):
    user = await db.users.find_one({"username": username})
    if user:
        return user
    


async def create_user(db: Database, payload: UserAuth):
    user = await db.users.insert_one({"username": payload.username, 
                                   "password": get_hashed_password(payload.password), 
                                   "recommendations": []})

    new_user = await db.users.find_one({"_id": user.inserted_id})

    return serialize_user(new_user)


async def get_user_recommendations(db: Database, id: str):
    user = await db.users.find_one({"_id": ObjectId(id)})
    recommendations = []

    for recommendation_id in user['recommendations']:
        recommendation = db['recommendation'].find_one({"_id": recommendation_id})

        recommendation['id'] = str(recommendation['_id'])
        recommendation.pop('_id')
        
        total_results = 0
        for _, value in recommendation['data'].items():
            total_results += len(value)
           
        recommendation['total'] = total_results
        recommendation.pop('data')

        recommendations.append(recommendation)
    return recommendations


    
    
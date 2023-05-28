from fastapi import Request
from settings import get_settings
from sklearn.neighbors import NearestNeighbors
from pymongo.database import Database
from bson import ObjectId
from datetime import datetime

settings = get_settings()

# Функции, которая возвращает результаты по каждому поисковому аниме отдельно, 
# а также объединенный набор данных с 10 лучшими рекомендациями по всем поисковым аниме на основе наименьшего расстояния:
async def get_recommendations(req: Request, search_words, n_recommendations=10) -> list:
    anime_data = list(await req.app.db.animelist.find().to_list(length=None))  # Загрузка данных аниме из базы данных
    
    for document in anime_data:
        document['id'] = str(document['_id'])
        document.pop("_id")

    recommendations = {}
    knn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=20, n_jobs=-1)
    knn.fit(req.app.data.csr_data_train)

    for word in search_words:
        recommendations = []

        # Фильтрация аниме по заданному слову в заголовке
        anime_search = [anime for anime in anime_data if word in anime['title']]
        if not anime_search:
            continue
        anime_id = anime_search[0]['anime_id']

        # Преобразование айдишника в индекс матрицы
        anime_id = req.app.data.user_item_matrix_train[req.app.data.user_item_matrix_train['anime_id'] == anime_id].index[0]

        # Поиск ближайших соседей и расстояний до них
        distances, indices = knn.kneighbors(req.app.data.csr_data_train[anime_id], n_neighbors=n_recommendations + 1)
        indices_list = indices.squeeze().tolist()[1:]
        distances_list = distances.squeeze().tolist()[1:]
        indices_distances = list(zip(indices_list, distances_list))

        # Получение рекомендаций и добавление их в список
        for ind_dist in indices_distances:
            anime_id = int(req.app.data.user_item_matrix_train.iloc[ind_dist[0]]['anime_id'])
            anime = next((anime for anime in anime_data if anime['anime_id'] == anime_id), None)
            if anime:
                recommendations.append(anime)

    return recommendations


async def create_recommendation(db: Database, user_id: str, recommendations: list):
    data = {}
    for el, values in recommendations.items():
        data[el] = []
        for value in values:
            data[el].append(ObjectId(value['id']))
    await db.recommendations.insert_one({"data": data, "search_words": list(recommendations.keys()), "user_id": ObjectId(user_id), "created_at": datetime.now()})


async def find_recommendation(db: Database, recommendation_id: str):
    recommendation = await db.recommendations.find_one({"_id": ObjectId(recommendation_id)})

    recommendation['id'] = str(recommendation['_id'])
    recommendation['user_id'] = str(recommendation['user_id'])
    recommendation.pop('_id')


    if recommendation:
        for key, value in recommendation['data'].items():
                titles = []

                for object_id in value:
                    title = await db.animelist.find_one({"_id": object_id})
                    title['id'] = str(title["_id"])
                    title.pop("_id")
                    titles.append(title)

                recommendation['data'][key] = titles
        print(recommendation)
        return recommendation
    return None

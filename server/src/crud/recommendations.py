from fastapi import Request
from settings import get_settings
from sklearn.neighbors import NearestNeighbors
from pymongo.database import Database
from bson import ObjectId

settings = get_settings()

# Функции, которая возвращает результаты по каждому поисковому аниме отдельно, 
# а также объединенный набор данных с 10 лучшими рекомендациями по всем поисковым аниме на основе наименьшего расстояния:
def get_recommendations(req: Request, search_words, n_recommendations=10) -> list :
    anime_data = list(req.app.db['animelist'].find())  # Загрузка данных аниме из базы данных
    
    for document in anime_data:
        document['_id'] = str(document['_id'])

    recommendations = {}
    knn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=20, n_jobs=-1)
    knn.fit(req.app.data.csr_data_train)

    for word in search_words:
        recommendations[word] = []

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
                recommendations[word].append(anime)

    return recommendations


def create_recommendation(db: Database, user_id: str, recommendations: list):
    data = {}
    for el, values in recommendations.items():
        data[el] = []
        for value in values:
            data[el].append(ObjectId(value['_id']))

    recommendation = db['recommendation'].insert_one({"data": data, "search_words": list(recommendations.keys())})
    db['users'].find_one_and_update({"_id": ObjectId(user_id)}, {'$push': {"recommendations": recommendation.inserted_id} })


def find_recommendation(db: Database, recommendation_id: str):
    recommendation = db['recommendation'].find_one({"_id": ObjectId(recommendation_id)})

    recommendation['id'] = str(recommendation['_id'])
    recommendation.pop('_id')

    if recommendation:
        for key, value in recommendation['data'].items():
                titles = []

                for object_id in value:
                    title = db['animelist'].find_one({"_id": object_id})
                    title['id'] = str(title["_id"])
                    title.pop("_id")
                    titles.append(title)

                recommendation['data'][key] = titles
        return recommendation
    return None

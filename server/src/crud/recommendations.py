from fastapi import Request
from settings import get_settings
from sklearn.neighbors import NearestNeighbors
from pymongo.database import Database
from bson import ObjectId
from datetime import datetime

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

settings = get_settings()

async def load_anime_data(db: Database):
    anime_data = list(await db.animelist.find().to_list(length=None))  # Загрузка данных аниме из базы данных
    
    for document in anime_data:
        document['id'] = str(document['_id'])
        document.pop("_id")    

    return anime_data

# Функции, которая возвращает результаты по каждому поисковому аниме отдельно, 
# а также объединенный набор данных с 10 лучшими рекомендациями по всем поисковым аниме на основе наименьшего расстояния:
async def get_item_based_recommendations(req: Request, search_words, n_recommendations=10) -> list:
    anime_data = await load_anime_data(req.app.db)


    recommendations = []
    knn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=20, n_jobs=-1)
    knn.fit(req.app.data.csr_data_train)

    for word in search_words:
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

async def get_content_based_recommendations(req: Request, search_words, n_recommendations=10):
    anime_data = await load_anime_data(req.app.db)

    # Создание матрицы признаков на основе синопсисов (content-based)
    content_matrix = pd.DataFrame(anime_data)  # Создаем DataFrame из данных аниме
    content_matrix['synopsis'] = content_matrix['synopsis'].fillna('')  # Заполняем пропущенные значения в столбце "synopsis" пустой строкой

    tfidf = TfidfVectorizer(stop_words='english')  # Создаем объект TfidfVectorizer для создания матрицы TF-IDF
    tfidf_matrix = tfidf.fit_transform(content_matrix['synopsis'].values.astype('U'))  # Преобразуем синопсисы в TF-IDF матрицу признаков

    knn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=n_recommendations+1, n_jobs=-1)  # Инициализируем модель NearestNeighbors для поиска ближайших соседей
    knn.fit(tfidf_matrix)  # Обучаем модель на матрице признаков

    recommendations = []

    for word in search_words:
        anime_search = content_matrix[content_matrix['title'].str.contains(word, case=False)]  # Ищем аниме, в названии которого есть заданное слово (без учета регистра)

        if anime_search.empty:
            continue

        anime_ids = anime_search['anime_id'].values
        anime_recommendations = []

        for anime_id in anime_ids:
            anime_index = content_matrix[content_matrix['anime_id'] == anime_id].index[0]
            distances, indices = knn.kneighbors(tfidf_matrix[anime_index], n_neighbors=n_recommendations + 1)
            indices_list = indices.squeeze()[1:].tolist()  # Исключаем первый элемент, который является самим аниме
            anime_recommendations.extend(indices_list)

        anime_recommendations = list(set(anime_recommendations))[:n_recommendations]  # Извлекаем n уникальных рекомендаций

        for anime_index in anime_recommendations:
            anime_info = content_matrix.loc[anime_index].to_dict()
            if anime_info['anime_id'] not in anime_ids:
                recommendations.append(anime_info)
    return recommendations

async def create_recommendation(db: Database, user_id: str, recommendations: list, search_words: list):
    data = []
    for el in recommendations:
        data.append(ObjectId(el['id']))
    new_recommendation = await db.recommendations.insert_one({"recommendations": data, "search_words": search_words, "user_id": ObjectId(user_id), "created_at": datetime.now()})
    return new_recommendation.inserted_id

async def find_recommendation(db: Database, recommendation_id: str):
    record = await db.recommendations.find_one({"_id": ObjectId(recommendation_id)})

    record['id'] = str(record['_id'])
    record['user_id'] = str(record['user_id'])
    record.pop('_id')


    if record:
        titles = []

        for object_id in record['recommendations']:
            title = await db.animelist.find_one({"_id": object_id})
            title['id'] = str(title["_id"])
            title.pop("_id")
            titles.append(title)

        record['recommendations'] = titles
        
        return record
    return None

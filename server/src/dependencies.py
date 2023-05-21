import os
import pandas as pd

from datetime import datetime

from fastapi import Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from starlette import status

from settings import get_settings
from utils import decode_jwt
from serializers import serialize_user
from sklearn.model_selection import train_test_split
from sklearn.neighbors import NearestNeighbors
from scipy.sparse import csr_matrix
import requests
import time

settings = get_settings()

oauth = OAuth2PasswordBearer(tokenUrl="/api/auth/login", scheme_name="JWT")


class Data:
    def __init__(self, csr_data_train, anime_data, user_item_matrix_train):
        self.csr_data_train = csr_data_train
        self.anime_data = anime_data
        self.user_item_matrix_train = user_item_matrix_train

async def get_current_user(
    request: Request,
    token: str = Depends(oauth),
) -> dict:
    try:
        token_data = decode_jwt(token)

        if datetime.fromtimestamp(token_data.exp) < datetime.now():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = request.app.db['users'].find_one({"username": token_data.username})

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find user",
        )
    
    return serialize_user(user)


def jikan_get_anime_full_by_id(anime_id):
    url = f"https://api.jikan.moe/v4/anime/{anime_id}/full"

    response = requests.get(url)
    if response.status_code == 200:
        anime = response.json()['data']
        return {
            "anime_id": anime['mal_id'],
            "cover": anime['images']['jpg']['image_url'],
            "title": anime['title'],
            "title_japanese": anime['title_japanese'],
            "type": anime['type'],
            "episodes": anime['episodes'],
            "airing": anime['airing'],
            "aired_from": anime['aired']['from'],
            "aired_to": anime['aired']['to'],
            "duration": anime['duration'],
            "rating": anime['rating'],
            "score": anime['score'],
            "synopsis": anime['synopsis'],
            "producers": anime['producers'],
            "studios": anime['studios'],
            "genres": anime['genres']
        }
    else:
        return None


def process_data_chunk(chunk):
    # Placeholder function, modify it with your actual processing logic
    processed_data = chunk + 1
    return processed_data


def init_dataset() -> Data:
  # Get the parent directory of the current file
  current_dir = os.path.dirname(os.path.abspath(__file__))

  # Construct the file path
  anime_ratings_path = os.path.join(current_dir, 'datasets', 'file_reduced.csv')
  anime_data_path = os.path.join(current_dir, 'datasets', 'anime.csv')



  anime_ratings_chunks = pd.read_csv(anime_ratings_path,
                                     usecols=["user_id", "anime_id", "rating"],
                                     dtype={"user_id": "int32", "anime_id": "int32", "rating": "int16"},
                                     engine='c',
                                     low_memory=True,
                                     chunksize=10000)
  
  # Concatenate the chunks into a single DataFrame
  anime_ratings = pd.concat(anime_ratings_chunks)

  # Process each chunk of data
  for chunk in anime_ratings_chunks:
      processed_chunk = process_data_chunk(chunk)
      # Do further operations with the processed chunk if needed
      print(processed_chunk.head())  # Example: Print the processed chunk's head

  # anime_ratings = pd.read_csv(anime_ratings_path, low_memory=False, decimal=',', usecols=["user_id", "anime_id","rating"])
  anime_data = pd.read_csv(anime_data_path, low_memory=False, decimal=',',
                           usecols=["anime_id","name","score","genres","english_name","japanese_name","type","episodes","aired","premiered","producers","studios","duration","rating"])

  # (60% train, 40% test)
  anime_ratings, train_ratings = train_test_split(anime_ratings, test_size=0.6, random_state=42)

  # (50% train, 50% test)
  train_ratings, test_ratings = train_test_split(train_ratings, test_size=0.5, random_state=42)

  # Пользователь должен оценить минимум 500 аниме (train_ratings)
  ntrain_ratings = train_ratings['user_id'].value_counts()
  train_ratings = train_ratings[train_ratings['user_id'].isin(ntrain_ratings[ntrain_ratings >= 500].index)].copy()

  # Пользователь должен оценить минимум 500 аниме (test_ratings)
  ntest_ratings = test_ratings['user_id'].value_counts()
  test_ratings = test_ratings[test_ratings['user_id'].isin(ntest_ratings[ntest_ratings >= 500].index)].copy()

  train_ratings = train_ratings.drop_duplicates()
  test_ratings = test_ratings.drop_duplicates()

  # Создание сводной таблицы (pivot table). 
  # По горизонтали будут аниме, по вертикали - пользователи, значения - оценки
  user_item_matrix_train = train_ratings.pivot(index = 'anime_id', columns = 'user_id', values= 'rating')

  # NaN преобразовываю в нули
  user_item_matrix_train.fillna(0, inplace = True)

  # Преобразую разреженную матрицу в формат csr
  # Метод values передаст функции csr_matrix только значения датафрейма
  csr_data_train = csr_matrix(user_item_matrix_train.values)

  # Сброшу индекс с помощью reset_index()
  user_item_matrix_train = user_item_matrix_train.rename_axis(None, axis = 1).reset_index()

  data = Data(csr_data_train, anime_data, user_item_matrix_train)
  return data

# Функции, которая возвращает результаты по каждому поисковому аниме отдельно, 
# а также объединенный набор данных с 10 лучшими рекомендациями по всем поисковым аниме на основе наименьшего расстояния:
def get_recommendations(data: Data, search_words, n=10):
    recommendations = []
    
    knn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=20, n_jobs=-1)
    knn.fit(data.csr_data_train)
    
    for word in search_words:
        # переименовать
        anime_search = data.anime_data[data.anime_data['name'].str.contains(word)]
        # переименовать
        anime_id = anime_search.iloc[0]['anime_id']
        # переименовать
        anime_id = data.user_item_matrix_train[data.user_item_matrix_train['anime_id'] == anime_id].index[0]
       
       
        distances, indices = knn.kneighbors(data.csr_data_train[anime_id], n_neighbors=n + 1)
        indices_list = indices.squeeze().tolist()
        distances_list = distances.squeeze().tolist()
        indices_distances = list(zip(indices_list, distances_list))
        indices_distances_sorted = sorted(indices_distances, key=lambda x: x[1], reverse=False)
        indices_distances_sorted = indices_distances_sorted[1:]

        # переименовать
        for ind_dist in indices_distances_sorted:
            anime_id = data.user_item_matrix_train.iloc[ind_dist[0]]['anime_id']

            # Jikan API. Return complete anime reousrce data
            anime_data = jikan_get_anime_full_by_id(int(anime_id))

            if (anime_data):
                recommendations.append(anime_data)
            
            # 3 req per sec or 60 req per min
            time.sleep(1/2)
    
    return {'recommendations': recommendations}





# {
#   "results": {
#     "Bleach": {
#       "recommendations": [
#         {
#           "name": "Bleach: The Sealed Sword Frenzy",
#           "distance": 0.7028268408633483
#         },
#         {
#           "name": "Magi: The Kingdom of Magic",
#           "distance": 0.7032154357766157
#         },
#     ]
#     },
#      },
#   "combined_recommendations": [
#     {
#       "name": "Naruto: Shippuuden Movie 2 - Kizuna",
#       "distance": 0.6819077597
#     },
#   ]
# }
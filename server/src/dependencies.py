import os
import pandas as pd

from datetime import datetime
from pymongo.database import Database

from fastapi import Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from starlette import status

from settings import get_settings
from utils import decode_jwt
from sklearn.model_selection import train_test_split
from scipy.sparse import csr_matrix
from crud.users import get_user_by_username
import re
import ast

settings = get_settings()

oauth = OAuth2PasswordBearer(tokenUrl="/api/auth/login", scheme_name="JWT")


current_dir = os.path.dirname(os.path.abspath(__file__))


class Data:
    def __init__(self, csr_data_train, user_item_matrix_train):
        self.csr_data_train = csr_data_train
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
    user = await get_user_by_username(request.app.db, token_data.username)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find user",
        )
    
    return user


def process_data_chunk(chunk):
    processed_data = chunk + 1
    return processed_data


def init_dataset() -> Data:
  anime_ratings_path = os.path.join(current_dir, 'datasets', 'ratings.csv')

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

  data = Data(csr_data_train, user_item_matrix_train)
  return data


def convert_to_minutes(duration):
    if 'hr' in duration and 'min' in duration:
        pattern = r'(\d+) hr (\d+) min'
        match = re.search(pattern, duration)
        hours = int(match.group(1))
        minutes = int(match.group(2))
        total_minutes = hours * 60 + minutes
    elif 'min' in duration:
        pattern = r'(\d+) min'
        match = re.search(pattern, duration)
        minutes = int(match.group(1))
        total_minutes = minutes
    elif 'hr' in duration:
        pattern = r'(\d+) hr'
        match = re.search(pattern, duration)
        hours = int(match.group(1))
        total_minutes = hours * 60
    else:
        total_minutes = None

    return total_minutes



async def init_animelist_collection(db: Database):
    n = await db.animelist.count_documents({})

    if n > 0:
        return

    migration_path = os.path.join(current_dir, 'datasets', 'migration.xlsx')
    data = pd.read_excel(migration_path, index_col=0, na_values=['[]',' '])

    for id, row in data.iterrows():
        try:
            producers = None
            genres = None
            studios = None
            duration = None
            
            if pd.notna(row["producers"]):
                data = ast.literal_eval(row["producers"])
                producers = list(map(lambda x: x['name'], data))

            if pd.notna(row["genres"]):
                data = ast.literal_eval(row["genres"])
                genres = list(map(lambda x: x['name'], data))

            if pd.notna(row["studios"]):
                data = ast.literal_eval(row["studios"])
                studios = list(map(lambda x: x['name'], data))               

            if pd.notna(row["duration"]):
                duration = convert_to_minutes(row["duration"])

        except:
            print(id)
        
        record = {
            "anime_id": id,
            "title": str(row["title"]) if pd.notna(row["title"]) else None,
            "title_japanese": str(row["title_japanese"]) if pd.notna(row["title_japanese"]) else None,
            "cover": row["cover"] if pd.notna(row["cover"]) else None,
            "type": row["type"] if pd.notna(row["type"]) else None,
            "episodes": int(row["episodes"]) if pd.notna(row["episodes"]) else None,
            "airing": row["airing"] == 1.0 if pd.notna(row["airing"]) else None,
            "aired_from": row["aired_from"] if pd.notna(row["aired_from"]) else None,
            "aired_to": row["aired_to"] if pd.notna(row["aired_to"]) else None,
            "duration": duration,
            "synopsis": row["synopsis"] if pd.notna(row["synopsis"]) else None,
            "producers": producers,
            "studios": studios,
            "genres": genres
        }

        try:
            db.animelist.insert_one(record)
        except:
            print(id)

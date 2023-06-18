# AnimeRecommendationApp

DEMO: [http://45.136.205.175/](http://45.136.205.175/)

Stack: Python 3.10, FastAPI, Next.js, Nginx, PostgreSQL

## Run project

### Dev run

In dev version Docker Compose uses `Dockerfile.dev` for buildings and
maps `./back/src` as volume for autoreloading and postgres container hasn't volume.

```bash
git clone https://github.com/Tsuchikage/AnimeRecommendationApp.git

mkdir -p AnimeRecommendationApp/server/src/datasets

cd AnimeRecommendationApp/server/src/datasets

wget https://storage.yandexcloud.net/anime/ratings.csv

wget https://storage.yandexcloud.net/anime/migration.xlsx

cd ~/AnimeRecommendationApp/

cp .env.example .env

docker-compose up --build -d
```

### Scrinshots
![1](https://github.com/stackoverfollowers/AnimeRecommendationApp/raw/main/docs/1.jpg)

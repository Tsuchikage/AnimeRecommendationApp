# AnimeRecommendationApp

DEMO: [http://45.136.205.175/](http://45.136.205.175/)

Stack: Python 3.10, FastAPI, Next.js, Nginx, PostgreSQL

## Run project

### Dev run

In dev version Docker Compose uses `Dockerfile.dev` for buildings and
maps `./back/src` as volume for autoreloading and postgres container hasn't volume.

```bash
cp .env.example .env
docker-compose -f docker-compose.dev.yaml up --build -d
```

# AnimeRecommendationApp

DEMO: [http://45.136.205.175/](http://45.136.205.175/)

Stack: Python 3.10, FastAPI, Next.js, Nginx, MongoDB

### Архитектура
![image](https://github.com/Tsuchikage/AnimeRecommendationApp/raw/main/docs/9.png)


## Run project

```bash
git clone https://github.com/Tsuchikage/AnimeRecommendationApp.git
```
```bash
mkdir -p AnimeRecommendationApp/server/src/datasets
```
```bash
cd AnimeRecommendationApp/server/src/datasets
```
```bash
wget https://storage.yandexcloud.net/anime/ratings.csv
```
```bash
wget https://storage.yandexcloud.net/anime/migration.xlsx
```
```bash
cd ~/AnimeRecommendationApp/
```
```bash
cp .env.example .env
```
```bash
docker-compose up --build -d
```

### Screenshots
![1](https://github.com/Tsuchikage/AnimeRecommendationApp/raw/main/docs/1.jpg)
![1](https://github.com/Tsuchikage/AnimeRecommendationApp/raw/main/docs/2.jpg)
![1](https://github.com/Tsuchikage/AnimeRecommendationApp/raw/main/docs/3.jpg)
![1](https://github.com/Tsuchikage/AnimeRecommendationApp/raw/main/docs/4.jpg)
![1](https://github.com/Tsuchikage/AnimeRecommendationApp/raw/main/docs/11.jpg)
![1](https://github.com/Tsuchikage/AnimeRecommendationApp/raw/main/docs/5.jpg)
![1](https://github.com/Tsuchikage/AnimeRecommendationApp/raw/main/docs/6.jpg)
![1](https://github.com/Tsuchikage/AnimeRecommendationApp/raw/main/docs/7.jpg)
![1](https://github.com/Tsuchikage/AnimeRecommendationApp/raw/main/docs/8.png)


## Описание проекта

### Задача
Разработать рекомендательный сервис, предоставляющий качественные рекомендации о том, как скрасить вечер, учитывая пользовательские предпочтения в жанрах и ограниченное количество времени (10-20 минут) для отдыха и развлечений.

### Описание рекомендательной системы
В проекте реализованы две рекомендательные системы: **item-based** (на основе схожести объектов) и **content-based** (на основе содержания).

**Item-based recommendation system**

Item-based рекомендательная система основана на анализе схожести между объектами на основе пользовательских оценок. В данном случае используется алгоритм ближайших соседей (k-nearest neighbors) для определения схожих аниме на основе их пользовательских рейтингов. Вот шаги, которые выполняются в этой рекомендательной системе:

**Подготовка данных:**

- Загружаются данные об аниме из базы данных MongoDB, включая информацию о заголовке, описании, типе, количестве эпизодов и т.д.
- Данные делятся на обучающий и тестовый наборы в соотношении **60% / 40%** для обучения и оценки модели.
- Создается обучающий набор данных **train\_ratings**, который содержит пользовательские оценки для аниме.

**Создание матрицы пользователь-объект:**

- Обучающий набор данных **train\_ratings** преобразуется в сводную таблицу (pivot table), где пользователи являются строками, а аниме - столбцами, а значениями являются пользовательские оценки.
- Значения NaN (отсутствующие оценки) заменяются нулями.
- Разреженная матрица преобразуется в формат CSR (Compressed Sparse Row) для оптимальной работы с ней.

**Поиск ближайших соседей:**

- Инициализируется модель ближайших соседей **knn** с использованием косинусного расстояния в качестве метрики и алгоритма "brute".
- Модель обучается на обучающей матрице данных.

**Получение рекомендаций:**

- Для каждого заданного слова (поискового запроса) выполняется следующее:
- Фильтрация аниме по заданному слову в заголовке.
- Преобразование идентификатора аниме в индекс матрицы.
- Поиск ближайших соседей выбранного аниме на основе обучающей матрицы данных.
- Получение информации о рекомендованных аниме и добавление их в список рекомендаций.
- Возвращается словарь с рекомендациями.


**Content-based recommendation system**

Content-based рекомендательная система основана на анализе сходства между объектами на основе их содержания или признаков. В данном случае используется алгоритм ближайших соседей (k-nearest neighbors) для определения схожих аниме на основе текстовых описаний (synopsis) аниме. Вот шаги, которые выполняются в этой рекомендательной системе:

**Подготовка данных:**

- Загружаются данные об аниме из базы данных MongoDB.
- Создается матрица признаков **tfidf\_matrix** на основе текстовых описаний (synopsis) аниме, используя TF-IDF (Term Frequency-Inverse Document Frequency).
- Загружается модель ближайших соседей **knn** с использованием косинусного расстояния в качестве метрики и алгоритма "brute".

**Получение рекомендаций:**

- Для каждого заданного слова (поискового запроса) выполняется следующее:
  - Поиск аниме, в названии которого есть заданное слово (без учета регистра).
  - Получение идентификаторов найденных аниме.
  - Для каждого идентификатора аниме выполняется следующее:
    - Нахождение индекса аниме в матрице признаков.
    - Поиск ближайших соседей выбранного аниме на основе матрицы признаков.
    - Получение информации о рекомендованных аниме и добавление их в список рекомендаций.
- Возвращается словарь с рекомендациями.



### Метрики
**Mean average precision at K (map@K)** - дает представление о том, насколько релевантен список рекомендуемых элементов. 
[Код подсчета метрик.](https://github.com/Tsuchikage/My-First-Data-Project-2/blob/dev/metrics_mapk_item_user_content_hybrid.ipynb)

![1](https://github.com/Tsuchikage/AnimeRecommendationApp/raw/main/docs/10.png)

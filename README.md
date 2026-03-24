# Movie Recommender SPA

A single-page application built with Django REST Framework, MongoDB, and Vanilla JavaScript.

## Setup Instructions

**MUST DO THIS**
Run it inside the terminal of the project.
```bash
python -m venv venv
```
```bash
.\venv\Scripts\activate
```
1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Ensure MongoDB is running**
   You can run MongoDB locally (e.g., `mongodb://localhost:27017`) or configure a cloud instance.
   Create a `.env` file in the root if you need to override credentials:
   ```env
   MONGO_URI=mongodb://localhost:27017
   MONGO_DB=movie_db
   ```

3. **Migrate Initial Data**
   Run the migration script to populate your database with 22 initial movies.
   ```bash
   python migrate_data.py
   ```

4. **Run the Server**
   ```bash
   python manage.py runserver
   ```
   Open `http://localhost:8000` in your browser.

## API Endpoints
- `GET /api/movies/` - List all movies (optional query parameter `?genre=Accion`)
- `GET /api/movies/<id>/` - Get detailed information on a single movie
- `GET /api/genres/` - List all unique genres available
- `POST /api/recommend/` - Get tailored movie recommendations based on a provided dictionary: `{"genres": ["Drama"]}`
- `GET /api/random/` - Retrieve a random featured movie
- `GET /api/stats/` - Retrieve the system's global metric statistics

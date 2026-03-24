import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from api.db import get_movies_col

def serialize_movie(doc):
    if not doc:
        return None
    # PyMongo documents have _id as ObjectId instead of hex strings
    return {
        "id": str(doc["_id"]),
        "title": doc.get("title", ""),
        "year": doc.get("year", 0),
        "genres": doc.get("genres", []),
        "added_date": doc.get("added_date"),
        "poster": doc.get("poster"),
        "plot_summary": doc.get("plot_summary"),
        "imdb_rating": doc.get("imdb_rating")
    }

class MovieListView(APIView):
    def get(self, request):
        col = get_movies_col()
        query = {}
        
        genre = request.query_params.get("genre")
        if genre:
            query["genres"] = {"$in": [genre.title()]}
            
        cursor = col.find(query).sort("year", -1)
        movies = [serialize_movie(m) for m in cursor]
        
        return Response({
            "count": len(movies),
            "movies": movies
        })

class MovieDetailView(APIView):
    def get(self, request, pk):
        col = get_movies_col()
        try:
            movie = col.find_one({"_id": ObjectId(pk)})
            if movie:
                return Response(serialize_movie(movie))
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response({"error": "Invalid ID format"}, status=status.HTTP_400_BAD_REQUEST)

class GenreListView(APIView):
    def get(self, request):
        col = get_movies_col()
        genres = col.distinct("genres")
        return Response([g for g in genres if g])

class RecommendView(APIView):
    def post(self, request):
        col = get_movies_col()
        genres = request.data.get("genres", [])
        if not genres:
            return Response({"error": "Please provide a list of genres"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Match movies that have any of the provided genres
        items = list(col.find({"genres": {"$in": genres}}))
        results = [serialize_movie(m) for m in items]
        
        if not results:
            return Response({
                "results": [],
                "featured_recommendation": None,
                "total_found": 0
            })
            
        featured = random.choice(results)
        # remove featured from results optionally, or keep it. Let's keep it but just return it as featured.
        
        return Response({
            "results": results,
            "featured_recommendation": featured,
            "total_found": len(results)
        })

class RandomMovieView(APIView):
    def get(self, request):
        col = get_movies_col()
        # MongoDB aggregation to sample 1 document
        samples = list(col.aggregate([{"$sample": {"size": 1}}]))
        if samples:
            return Response(serialize_movie(samples[0]))
        return Response({"error": "No movies found"}, status=status.HTTP_404_NOT_FOUND)

class StatsView(APIView):
    def get(self, request):
        col = get_movies_col()
        total_movies = col.count_documents({})
        total_genres = len(col.distinct("genres"))
        return Response({
            "total_movies": total_movies,
            "total_genres": total_genres
        })

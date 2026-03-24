from django.urls import path
from . import views

urlpatterns = [
    path('movies/', views.MovieListView.as_view(), name='movie-list'),
    path('movies/<str:pk>/', views.MovieDetailView.as_view(), name='movie-detail'),
    path('genres/', views.GenreListView.as_view(), name='genre-list'),
    path('recommend/', views.RecommendView.as_view(), name='recommend'),
    path('random/', views.RandomMovieView.as_view(), name='random'),
    path('stats/', views.StatsView.as_view(), name='stats'),
]

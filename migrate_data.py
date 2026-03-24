import pymongo
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
MONGO_DB = os.getenv('MONGO_DB', 'movie_db')

def migrate():
    client = pymongo.MongoClient(MONGO_URI)
    db = client[MONGO_DB]
    col = db["movies"]
    
    col.drop()  # Clear existing data
    
    movies = [
        {"title": "Inception", "year": 2010, "genres": ["Ciencia Ficcion", "Accion"], "plot_summary": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", "imdb_rating": 8.8, "poster": "https://m.media-amazon.com/images/I/91BcO4a7S6L._AC_SY679_.jpg"},
        {"title": "Interstellar", "year": 2014, "genres": ["Ciencia Ficcion", "Drama"], "plot_summary": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", "imdb_rating": 8.6, "poster": "https://m.media-amazon.com/images/I/A1JVqNMI7UL._AC_SY679_.jpg"},
        {"title": "The Dark Knight", "year": 2008, "genres": ["Accion", "Drama"], "plot_summary": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", "imdb_rating": 9.0, "poster": "https://m.media-amazon.com/images/I/91KkWf50SoL._AC_UY879_.jpg"},
        {"title": "Titanic", "year": 1997, "genres": ["Romance", "Drama"], "plot_summary": "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.", "imdb_rating": 7.9, "poster": "https://m.media-amazon.com/images/I/71+eW+1yM-L._AC_SY679_.jpg"},
        {"title": "The Notebook", "year": 2004, "genres": ["Romance"], "plot_summary": "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom.", "imdb_rating": 7.8, "poster": "https://m.media-amazon.com/images/I/61Nl-V8D+ZL._AC_SY679_.jpg"},
        {"title": "The Conjuring", "year": 2013, "genres": ["Terror"], "plot_summary": "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.", "imdb_rating": 7.5, "poster": "https://m.media-amazon.com/images/I/81I-uH1Fw-L._AC_SY679_.jpg"},
        {"title": "Parasite", "year": 2019, "genres": ["Drama", "Suspenso"], "plot_summary": "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.", "imdb_rating": 8.5, "poster": "https://m.media-amazon.com/images/I/91Nn7H0-50L._AC_SY679_.jpg"},
        {"title": "Joker", "year": 2019, "genres": ["Drama", "Crimen"], "plot_summary": "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime.", "imdb_rating": 8.4, "poster": "https://m.media-amazon.com/images/I/71R12b05bAL._AC_SY679_.jpg"},
        {"title": "Coco", "year": 2017, "genres": ["Animacion", "Familiar"], "plot_summary": "Aspiring musician Miguel, confronted with his family's ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather, a legendary singer.", "imdb_rating": 8.4, "poster": "https://m.media-amazon.com/images/I/81vJJpaH7FL._AC_SY679_.jpg"},
        {"title": "Avengers: Endgame", "year": 2019, "genres": ["Accion", "Superheroes"], "plot_summary": "After the devastating events of Avengers: Infinity War (2018), the universe is in ruins.", "imdb_rating": 8.4, "poster": "https://m.media-amazon.com/images/I/81ExhpBEbHL._AC_SY679_.jpg"},
        {"title": "Gladiator", "year": 2000, "genres": ["Accion", "Drama"], "plot_summary": "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.", "imdb_rating": 8.5, "poster": "https://m.media-amazon.com/images/I/61H-o4e1XwL._AC_SY679_.jpg"},
        {"title": "The Matrix", "year": 1999, "genres": ["Ciencia Ficcion", "Accion"], "plot_summary": "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.", "imdb_rating": 8.7, "poster": "https://m.media-amazon.com/images/I/51EG732BV3L._AC_.jpg"},
        {"title": "Forrest Gump", "year": 1994, "genres": ["Drama", "Romance"], "plot_summary": "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.", "imdb_rating": 8.8, "poster": "https://m.media-amazon.com/images/I/61Q60PZlC1L._AC_SY679_.jpg"},
        {"title": "The Shawshank Redemption", "year": 1994, "genres": ["Drama"], "plot_summary": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", "imdb_rating": 9.3, "poster": "https://m.media-amazon.com/images/I/519NBNHX5BL._AC_SY679_.jpg"},
        {"title": "The Godfather", "year": 1972, "genres": ["Crimen", "Drama"], "plot_summary": "The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.", "imdb_rating": 9.2, "poster": "https://m.media-amazon.com/images/I/815QxZ8xRcL._AC_SY679_.jpg"},
        {"title": "Toy Story", "year": 1995, "genres": ["Animacion", "Familiar"], "plot_summary": "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.", "imdb_rating": 8.3, "poster": "https://m.media-amazon.com/images/I/71aLW1x+GjL._AC_SY679_.jpg"},
        {"title": "A Quiet Place", "year": 2018, "genres": ["Terror", "Suspenso"], "plot_summary": "In a post-apocalyptic world, a family is forced to live in silence while hiding from monsters with ultra-sensitive hearing.", "imdb_rating": 7.5, "poster": "https://m.media-amazon.com/images/I/81yR1-Hw+5L._AC_SY879_.jpg"},
        {"title": "La La Land", "year": 2016, "genres": ["Romance", "Drama"], "plot_summary": "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.", "imdb_rating": 8.0, "poster": "https://m.media-amazon.com/images/I/81bN2f+F5kL._AC_SY679_.jpg"},
        {"title": "Mad Max: Fury Road", "year": 2015, "genres": ["Accion"], "plot_summary": "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max.", "imdb_rating": 8.1, "poster": "https://m.media-amazon.com/images/I/81XzIeE2-oL._AC_SY679_.jpg"},
        {"title": "The Lion King", "year": 1994, "genres": ["Animacion", "Familiar"], "plot_summary": "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.", "imdb_rating": 8.5, "poster": "https://m.media-amazon.com/images/I/81qEw9pQJNL._AC_SY679_.jpg"},
        {"title": "Spider-Man: Into the Spider-Verse", "year": 2018, "genres": ["Animacion", "Accion"], "plot_summary": "Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.", "imdb_rating": 8.4, "poster": "https://m.media-amazon.com/images/I/81r1KEDr8SL._AC_SY679_.jpg"},
        {"title": "Get Out", "year": 2017, "genres": ["Terror", "Suspenso"], "plot_summary": "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.", "imdb_rating": 7.7, "poster": "https://m.media-amazon.com/images/I/71wZ3b3T9UL._AC_SY679_.jpg"}
    ]
    
    for m in movies:
        m["added_date"] = datetime.datetime.utcnow()
    
    col.insert_many(movies)
    print(f"Migrated {len(movies)} movies successfully.")

if __name__ == "__main__":
    migrate()

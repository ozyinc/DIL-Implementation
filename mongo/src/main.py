from pymongo import MongoClient

from dotenv import load_dotenv
from os import getenv
from generate import generate

load_dotenv()

username = getenv("MONGO_USER", "root")
passwd = getenv("MONGO_PASS", "example")
db_name = getenv("MONGO_DB", "test")
host = getenv("MONGO_HOST", "0.0.0.0")

client = MongoClient(f"mongodb://{username}:{passwd}@{host}:27017/")
client.drop_database(db_name)
db = client.get_database(db_name)

generate(db)

import query

queries_to_run = [
    query.hard_to_solve,
    query.already_attended_events_suggested,
    query.already_solved_exercises_suggested,
    query.event_suggestions_collide_with_busy_hours,
    query.events_collide_count_with_student_busy_times,
    query.exercises_presented_more_than_once,
    query.get_colliding_event_ids_per_location,
    query.student_count_eligible_for_events
]

for query in queries_to_run:
    print()
    print("***")
    print(f"Running: {query.__name__}")
    print("----")
    print()
    print(*list(query(db)), sep="\n")

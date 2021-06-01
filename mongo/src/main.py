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

from query import hard_to_solve

print(*list(hard_to_solve(db)), sep="\n")

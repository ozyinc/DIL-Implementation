from dataclasses import field, asdict
from faker import Faker
from inspect import isclass
from pymongo.database import Database

Faker.seed(1)
faker = Faker("it_IT")

BASE_URL = "https://cdn.sideducation.it/"


def f(x):
    return field(default_factory=x)


def v(x):
    return field(default=x)


random_id = lambda: faker.random_int(min=0, max=4000000)
url = lambda extension: faker.lexify(f"{BASE_URL}{'?' * 16}.{extension}")
image_url = lambda: url("jpg")
audio_url = lambda: url("mp4")


def build(factory_):
    built = factory_()
    if isclass(built):
        built = built()
    return built


def lst(factory_, min=0, max=20):
    return lambda: [build(factory_) for _ in range(faker.random_int(min=min, max=max))]


from datetime import datetime, date, timedelta


def date_to_datetime(date: date):
    return datetime(year=date.year, month=date.month, day=date.day)


def add_seconds_to_date(date: date, seconds: int):
    delta = timedelta(0, seconds)
    return date + delta


def make_and_save(factory, count: int, db: Database, collection_name: str):
    data = [asdict(factory()) for _ in range(count)]
    db.drop_collection(collection_name)
    coll = db.get_collection(collection_name)
    result = coll.insert_many(data)
    ids = result.inserted_ids
    return lambda: faker.random_element(elements=ids)


def get_first_of_week(date_: date):
    return date.fromordinal((date_.toordinal() - date_.isoweekday()))

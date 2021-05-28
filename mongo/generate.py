from faker import Faker
from dataclasses import dataclass, field, asdict
from collections import OrderedDict
from typing import List, Optional
from enum import Enum


Faker.seed(1)
student_faker = Faker(OrderedDict([
    # ("ar-AA", 5), # Writes in Arabic :D
    ("it-IT", 2),

]))
it_faker = Faker("it_IT")


def f(x):
    return field(default_factory=x)


random_id = lambda: it_faker.random_int(min=0, max=4000000)
url = lambda extension: it_faker.lexify(f"{BASE_URL}??????????????????.{extension}")
image_url = lambda: url("jpg")
audio_url = lambda: url("mp4")


def lst(factory_, min=0, max=20):
    return lambda: [factory_() for _ in range(it_faker.random_int(min=min, max=max))]


@dataclass
class Skill:
    name: str = f(lambda: it_faker.text(max_nb_chars=20))
    id: int = f(random_id)


all_skills = [Skill() for _ in range(200)]

from datetime import datetime, date


def date_to_datetime(date: date):
    return datetime(year=date.year, month=date.month, day=date.day)


@dataclass
class PersonalInfo:
    cf: str = f(it_faker.ssn)
    name: str = f(student_faker.name)
    gender: str = f(lambda: it_faker.random_element(elements=('Male', 'Female', 'Other')))
    birthday: Optional[datetime] = f(
        lambda: date_to_datetime(it_faker.date_between(start_date="-50y", end_date="-18y")))


@dataclass
class Subject:
    name: str = f(it_faker.word)
    id: int = f(random_id)


all_subjects = [Subject() for _ in range(50)]


#### EXERCISES

MULTIPLE_CHOICE = "multipleChoice"
IMAGE_QUESTION = "imageQuestion"
IMAGE_CHOICE = "imageChoice"
HANDWRITING = "handwriting"
SPEAKING = "speaking"
FREE_TEXT = "freeText"
LISTENING = "listening"


@dataclass
class BaseExercise:
    question: str = f(lambda: it_faker.sentence())


@dataclass
class MultipleChoiceExercise(BaseExercise):
    exType = MULTIPLE_CHOICE
    options: List[str] = f(lst(it_faker.sentence, 4, 6))
    correctIndex: int = f(lambda: it_faker.random_int(min=0, max=4))


BASE_URL = "https://cdn.sideducation.it/"


@dataclass
class ImageQuestionExercise(MultipleChoiceExercise):
    exType = IMAGE_QUESTION
    imageUrl: str = f(image_url)


@dataclass
class ImageChoiceExercise(BaseExercise):
    exType = IMAGE_CHOICE
    optionUrls: List[str] = f(lst(image_url, min=4, max=9))
    correctIndex: int = f(lambda: it_faker.random_int(min=0, max=4))


@dataclass
class HandWritingExercise(BaseExercise):
    exType = HANDWRITING
    correctAnswer: str = f(lambda: it_faker.word())
    samples: List[str] = f(lst(image_url, min=2, max=4))


@dataclass
class SpeakingExercise(BaseExercise):
    exType = SPEAKING
    correctAnswer: str = f(lambda: it_faker.sentence())
    sample: str = f(audio_url)


@dataclass
class Exercise:
    difficulty: str = f(lambda: it_faker.random_element(elements=("Easy", "Medium", "Hard")))
    subject: Subject = f(lambda: it_faker.random_element(elements=all_subjects))
    content: BaseExercise = f(lambda: it_faker.random_element(elements=(
        MultipleChoiceExercise, ImageQuestionExercise, ImageChoiceExercise, HandWritingExercise, SpeakingExercise))())


@dataclass
class Solves:
    exercise: Exercise = f(Exercise)
    score: int = f(lambda: it_faker.random_int(0, 100))
    feedback: List[str] = f(lambda: it_faker.sentences(nb=3))


class EvaluationType(Enum):
    STUDY_PLAN_ASSIGNMENT = "studyPlan"
    SUBJECT_EVALUATION = "subjectEvaluation"


@dataclass
class Evaluation:
    type_: EvaluationType = f(lambda: it_faker.random_element(elements=(elem.value for elem in EvaluationType)))
    solved: List[Solves] = f(lst(Solves))
    todo: List[Exercise] = f(lst(Exercise))


# Evaluations and study plan assignment tests are same they exist on student
# We generate and embed exercises on students.

#### Events

@dataclass
class Event:
    pass


#### Study Plan

@dataclass
class Student:
    account_id: int = f(random_id)
    personal_info: PersonalInfo = f(PersonalInfo)
    skill_set: List[Skill] = f(lambda: it_faker.random_elements(elements=all_skills, length=10))
    evaluations: Evaluation = f(lst(Evaluation))
    tutorial_status: str = "done"
    exercise_attempts: List[Solves] = f(lst(Solves))
    events: str = f(it_faker.text)
    study_plan: str = f(it_faker.text)


from pymongo import MongoClient
from os import getenv
username = getenv("MONGO_USER", "root")
passwd = getenv("MONGO_PASS", "example")
db_name = getenv("MONGO_DB", "test")
coll_name = getenv("MONGO_COLL", "test")
student_count = getenv("STUDENT_COUNT", "5")
host = getenv("MONGO_HOST", "0.0.0.0")
client = MongoClient(f"mongodb://{username}:{passwd}@{host}:27017/")
db = client.get_database(db_name)
db.drop_collection(coll_name)
coll = db.get_collection(coll_name)
elems = [asdict(Student()) for _ in range(int(student_count))]
coll.insert_many(elems)

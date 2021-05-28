from faker import Faker
from dataclasses import dataclass, field, asdict
from collections import OrderedDict
from typing import List, Optional, Union
from enum import Enum
from os import getenv
from dotenv import load_dotenv
load_dotenv()

skill_count = int(getenv("SKILL_COUNT", "200"))
subject_count = int(getenv("SUBJECT_COUNT", "50"))
lecture_count = int(getenv("LECTURE_COUNT", "30"))
event_count = int(getenv("EVENT_COUNT", "20"))
student_count = int(getenv("STUDENT_COUNT", "5"))

Faker.seed(1)
student_faker = Faker(OrderedDict([
    # ("ar-AA", 5), # Writes in Arabic :D
    ("it-IT", 2),

]))
it_faker = Faker("it_IT")


def f(x):
    return field(default_factory=x)


def v(x):
    return field(default=x)


random_id = lambda: it_faker.random_int(min=0, max=4000000)
url = lambda extension: it_faker.lexify(f"{BASE_URL}{'?' * 16}.{extension}")
image_url = lambda: url("jpg")
audio_url = lambda: url("mp4")


def lst(factory_, min=0, max=20):
    return lambda: [factory_() for _ in range(it_faker.random_int(min=min, max=max))]


@dataclass
class Skill:
    name: str = f(lambda: it_faker.text(max_nb_chars=20))
    id: int = f(random_id)


all_skills = [Skill() for _ in range(skill_count)]

from datetime import datetime, date


def date_to_datetime(date: date):
    return datetime(year=date.year, month=date.month, day=date.day)


@dataclass
class PersonalInfo:
    cf: str = f(it_faker.ssn)
    name: str = f(student_faker.name)
    gender: str = f(lambda: it_faker.random_element(elements=('Male', 'Female', 'Other')))
    birthday: Optional[datetime] = f(
        lambda: date_to_datetime(it_faker.date_of_birth(minimum_age=18, maximum_age=70)))


@dataclass
class Subject:
    name: str = f(it_faker.word)
    id: int = f(random_id)


all_subjects = [Subject() for _ in range(subject_count)]

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
    exType: str = v(MULTIPLE_CHOICE)
    options: List[str] = f(lst(it_faker.sentence, 4, 6))
    correctIndex: int = f(lambda: it_faker.random_int(min=0, max=4))


BASE_URL = "https://cdn.sideducation.it/"


@dataclass
class ImageQuestionExercise(MultipleChoiceExercise):
    exType: str = v(IMAGE_QUESTION)
    imageUrl: str = f(image_url)


@dataclass
class ImageChoiceExercise(BaseExercise):
    exType: str = v(IMAGE_CHOICE)
    optionUrls: List[str] = f(lst(image_url, min=4, max=9))
    correctIndex: int = f(lambda: it_faker.random_int(min=0, max=4))


@dataclass
class HandWritingExercise(BaseExercise):
    exType: str = v(HANDWRITING)
    correctAnswer: str = f(lambda: it_faker.word())
    samples: List[str] = f(lst(image_url, min=2, max=4))


@dataclass
class SpeakingExercise(BaseExercise):
    exType: str = v(SPEAKING)
    correctAnswer: str = f(lambda: it_faker.sentence())
    sample: str = f(audio_url)


all_difficulties = ("Easy", "Medium", "Hard")


@dataclass
class Exercise:
    difficulty: str = f(lambda: it_faker.random_element(elements=all_difficulties))
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
class ExternalPerson:
    name: str = f(it_faker.name)
    company: str = f(it_faker.company)
    email: str = f(it_faker.email)
    about: str = f(it_faker.paragraph)
    job: str = f(it_faker.job)
    skills: List[Skill] = f(lambda: it_faker.random_elements(elements=all_skills, length=5))


@dataclass
class ExternalCompany:
    name: str = f(it_faker.company)
    slogan: str = f(it_faker.catch_phrase)
    description: str = f(it_faker.paragraph)


def get_first_of_week(date_: date):
    return date.fromordinal((date_.toordinal() - date_.isoweekday()))


@dataclass
class SlottedTiming:
    week: datetime = f(
        lambda: date_to_datetime(get_first_of_week(it_faker.date_between(start_date="today", end_date="+1y"))))
    slot: int = f(lambda: it_faker.random_int(0, 75))


@dataclass
class CustomIntervalTiming:
    start: datetime = f(lambda: it_faker.date_time_this_year(False, True))
    end: datetime = f(lambda: it_faker.date_time_this_year(False, True))


Timing = Union[SlottedTiming, CustomIntervalTiming]
ExternalAttendee = Union[ExternalPerson, ExternalCompany]


@dataclass
class SkillItem:
    skill: Skill = f(lambda: it_faker.random_element(elements=all_skills))
    level: int = f(lambda: it_faker.random_int(min=1, max=5))


@dataclass
class PassedSubject:
    subject: Subject = f(lambda: it_faker.random_element(elements=all_subjects))


@dataclass
class HasSkillLevel:
    skill: SkillItem = f(SkillItem)


all_lectures = [random_id() for _ in range(lecture_count)]


@dataclass
class AttendsLecture:
    lecture_id: int = f(it_faker.random_element(elements=all_lectures))


@dataclass
class SolvedExercisesOf:
    of_subject: Subject = f(lambda: it_faker.random_element(elements=all_subjects))
    difficulty: str = f(lambda: it_faker.random_element(elements=all_difficulties))
    amount: int = f(lambda: it_faker.random_int(min=1, max=20))


all_join_conditions = [PassedSubject, HasSkillLevel, AttendsLecture, SolvedExercisesOf]
JoinCondition = Union[PassedSubject, HasSkillLevel, AttendsLecture, SolvedExercisesOf]


@dataclass
class Event:
    content: str = f(it_faker.paragraphs)
    external_attendees: List[ExternalAttendee] = f(
        lst(it_faker.random_element(elements=[ExternalCompany, ExternalPerson]), 0, 3))
    timing: List[Timing] = f(lst(it_faker.random_element(elements=[SlottedTiming, CustomIntervalTiming]), 1, 4))
    location_id: int = f(random_id)
    supporting_subject: List[Subject] = f(lst(lambda: it_faker.random_element(elements=all_subjects), 1, 4))
    join_conditions: List[JoinCondition] = f(lst(it_faker.random_element(elements=all_join_conditions), 0, 5))


all_events = [Event() for _ in range(event_count)]


@dataclass
class EventAttendance:
    event: Event = f(lambda: it_faker.random_element(elements=all_events))
    feedback: str = f(it_faker.paragraph)
    rating: int = f(lambda: it_faker.random_int(0, 5))


#### Study Plan


@dataclass
class Student:
    account_id: int = f(random_id)
    personal_info: PersonalInfo = f(PersonalInfo)
    skill_set: List[SkillItem] = f(lst(SkillItem, 0, 10))
    evaluations: Evaluation = f(lst(Evaluation))
    tutorial_status: str = v("done")
    exercise_attempts: List[Solves] = f(lst(Solves))
    events: List[Event] = f(lst(EventAttendance, 0, 20))
    study_plan: str = f(it_faker.text)


students = [asdict(Student()) for _ in range(student_count)]

from pymongo import MongoClient

username = getenv("MONGO_USER", "root")
passwd = getenv("MONGO_PASS", "example")
db_name = getenv("MONGO_DB", "test")
coll_name = getenv("MONGO_COLL", "test")
host = getenv("MONGO_HOST", "0.0.0.0")
client = MongoClient(f"mongodb://{username}:{passwd}@{host}:27017/")
db = client.get_database(db_name)
db.drop_collection(coll_name)
coll = db.get_collection(coll_name)
coll.insert_many(students)

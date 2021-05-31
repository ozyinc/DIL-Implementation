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
exercise_count = int(getenv("EXERCISE_COUNT", "1500"))

from pymongo import MongoClient

username = getenv("MONGO_USER", "root")
passwd = getenv("MONGO_PASS", "example")
db_name = getenv("MONGO_DB", "test")
host = getenv("MONGO_HOST", "0.0.0.0")
client = MongoClient(f"mongodb://{username}:{passwd}@{host}:27017/")
client.drop_database(db_name)
db = client.get_database(db_name)

Faker.seed(1)
faker = Faker("it_IT")


def save_and_ret_generator(collection_name: str, data: List[dict]):
    db.drop_collection(collection_name)
    coll = db.get_collection(collection_name)
    result = coll.insert_many(data)
    ids = result.inserted_ids
    return lambda: faker.random_element(elements=ids)


def f(x):
    return field(default_factory=x)


def v(x):
    return field(default=x)


random_id = lambda: faker.random_int(min=0, max=4000000)
url = lambda extension: faker.lexify(f"{BASE_URL}{'?' * 16}.{extension}")
image_url = lambda: url("jpg")
audio_url = lambda: url("mp4")


def lst(factory_, min=0, max=20):
    return lambda: [factory_() for _ in range(faker.random_int(min=min, max=max))]


Skill = int
all_skills = [random_id() for _ in range(skill_count)]

from datetime import datetime, date


def date_to_datetime(date: date):
    return datetime(year=date.year, month=date.month, day=date.day)


@dataclass
class PersonalInfo:
    cf: str = f(faker.ssn)
    name: str = f(faker.name)
    gender: str = f(lambda: faker.random_element(elements=('Male', 'Female', 'Other')))
    birthday: Optional[datetime] = f(
        lambda: date_to_datetime(faker.date_of_birth(minimum_age=18, maximum_age=70)))


Subject = int

all_subjects = [random_id() for _ in range(subject_count)]

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
    question: str = f(faker.sentence)


@dataclass
class MultipleChoiceExercise(BaseExercise):
    exType: str = v(MULTIPLE_CHOICE)
    options: List[str] = f(lst(faker.sentence, 4, 6))
    correctIndex: int = f(lambda: faker.random_int(min=0, max=4))


BASE_URL = "https://cdn.sideducation.it/"


@dataclass
class ImageQuestionExercise(MultipleChoiceExercise):
    exType: str = v(IMAGE_QUESTION)
    imageUrl: str = f(image_url)


@dataclass
class ImageChoiceExercise(BaseExercise):
    exType: str = v(IMAGE_CHOICE)
    optionUrls: List[str] = f(lst(image_url, min=4, max=9))
    correctIndex: int = f(lambda: faker.random_int(min=0, max=4))


@dataclass
class HandWritingExercise(BaseExercise):
    exType: str = v(HANDWRITING)
    correctAnswer: str = f(lambda: faker.word())
    samples: List[str] = f(lst(image_url, min=2, max=4))


@dataclass
class SpeakingExercise(BaseExercise):
    exType: str = v(SPEAKING)
    correctAnswer: str = f(faker.sentence)
    sample: str = f(audio_url)


all_difficulties = ("Easy", "Medium", "Hard")


@dataclass
class Exercise:
    difficulty: str = f(lambda: faker.random_element(elements=all_difficulties))
    subject: Subject = f(lambda: faker.random_element(elements=all_subjects))
    content: BaseExercise = f(lambda: faker.random_element(elements=(
        MultipleChoiceExercise, ImageQuestionExercise, ImageChoiceExercise, HandWritingExercise, SpeakingExercise))())


all_exercises = [asdict(Exercise()) for _ in range(exercise_count)]

random_exercise = save_and_ret_generator("exercise", all_exercises)


@dataclass
class Solves:
    exercise: Exercise = f(random_exercise)
    score: int = f(lambda: faker.random_int(0, 100))
    feedback: List[str] = f(lambda: faker.sentences(nb=3))


class EvaluationType(Enum):
    STUDY_PLAN_ASSIGNMENT = "studyPlan"
    SUBJECT_EVALUATION = "subjectEvaluation"


@dataclass
class Evaluation:
    type_: EvaluationType = f(lambda: faker.random_element(elements=(elem.value for elem in EvaluationType)))
    solved: List[Solves] = f(lst(Solves))
    todo: List[Exercise] = f(lst(random_exercise))


# Evaluations and study plan assignment tests are same they exist on student
# We generate and embed exercises on students.

#### Events

@dataclass
class ExternalPerson:
    name: str = f(faker.name)
    company: str = f(faker.company)
    email: str = f(faker.email)
    about: str = f(faker.paragraph)
    job: str = f(faker.job)
    skills: List[Skill] = f(lambda: faker.random_elements(elements=all_skills, length=5))


@dataclass
class ExternalCompany:
    name: str = f(faker.company)
    slogan: str = f(faker.catch_phrase)
    description: str = f(faker.paragraph)


def get_first_of_week(date_: date):
    return date.fromordinal((date_.toordinal() - date_.isoweekday()))


@dataclass
class SlottedTiming:
    week: datetime = f(
        lambda: date_to_datetime(get_first_of_week(faker.date_between(start_date="today", end_date="+1y"))))
    slot: int = f(lambda: faker.random_int(0, 75))


@dataclass
class CustomIntervalTiming:
    start: datetime = f(lambda: faker.date_time_this_year(False, True))
    end: datetime = f(lambda: faker.date_time_this_year(False, True))


Timing = Union[SlottedTiming, CustomIntervalTiming]
ExternalAttendee = Union[ExternalPerson, ExternalCompany]


@dataclass
class SkillItem:
    skill: Skill = f(lambda: faker.random_element(elements=all_skills))
    level: int = f(lambda: faker.random_int(min=1, max=5))


@dataclass
class PassedSubject:
    subject: Subject = f(lambda: faker.random_element(elements=all_subjects))


@dataclass
class HasSkillLevel:
    skill: SkillItem = f(SkillItem)


all_lectures = [random_id() for _ in range(lecture_count)]


@dataclass
class AttendsLecture:
    lecture_id: int = f(lambda: faker.random_element(elements=all_lectures))


@dataclass
class SolvedExercisesOf:
    of_subject: Subject = f(lambda: faker.random_element(elements=all_subjects))
    difficulty: str = f(lambda: faker.random_element(elements=all_difficulties))
    amount: int = f(lambda: faker.random_int(min=1, max=20))


all_join_conditions = [PassedSubject, HasSkillLevel, AttendsLecture, SolvedExercisesOf]
JoinCondition = Union[PassedSubject, HasSkillLevel, AttendsLecture, SolvedExercisesOf]


@dataclass
class Event:
    content: str = f(faker.paragraphs)
    external_attendees: List[ExternalAttendee] = f(
        lst(faker.random_element(elements=[ExternalCompany, ExternalPerson]), 0, 3))
    timing: List[Timing] = f(lst(faker.random_element(elements=[SlottedTiming, CustomIntervalTiming]), 1, 4))
    location_id: int = f(random_id)
    supporting_subject: List[Subject] = f(lst(lambda: faker.random_element(elements=all_subjects), 1, 4))
    join_conditions: List[JoinCondition] = f(lst(faker.random_element(elements=all_join_conditions), 0, 5))


all_events = [asdict(Event()) for _ in range(event_count)]

random_event = save_and_ret_generator("events", all_events)


@dataclass
class EventAttendance:
    event: Event = f(random_event)
    feedback: str = f(faker.paragraph)
    rating: int = f(lambda: faker.random_int(0, 5))


#### Study Plan
@dataclass
class CourseAttendance:
    lecture_id: int = f(lambda: faker.random_element(elements=all_lectures))
    attended_course: List[bool] = f(lst(faker.pybool, 10, 15))
    homework_exercises: List[Exercise] = f(lst(random_exercise))


@dataclass
class StudyPlan:
    courses: List[CourseAttendance] = f(lst(CourseAttendance, 0, 10))
    busy_times: List[Timing] = f(lst(faker.random_element(elements=[SlottedTiming, CustomIntervalTiming]), 1, 4))
    complete: bool = f(faker.pybool)
    suggested_events: List[Event] = f(lst(random_event, 0, 10))
    suggested_exercises: List[Exercise] = f(lst(random_exercise, 0, 15))


@dataclass
class Student:
    account_id: int = f(random_id)
    personal_info: PersonalInfo = f(PersonalInfo)
    skill_set: List[SkillItem] = f(lst(SkillItem, 0, 10))
    evaluations: Evaluation = f(lst(Evaluation))
    tutorial_status: str = v("done")
    exercise_attempts: List[Solves] = f(lst(Solves))
    events: List[Event] = f(lst(EventAttendance, 0, 20))
    study_plan: str = f(StudyPlan)


students = [asdict(Student()) for _ in range(student_count)]
save_and_ret_generator("students", students)

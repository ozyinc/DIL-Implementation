from faker import Faker
from dataclasses import dataclass, field, asdict
from collections import OrderedDict
from typing import List, Optional
from enum import Enum
import json

Faker.seed(1)
student_faker = Faker(OrderedDict([
    # ("ar-AA", 5), # Writes in Arabic :D
    ("it-IT", 2),

]))
it_faker = Faker("it_IT")


def f(x):
    return field(default_factory=x)


random_id = lambda: it_faker.random_int(min=0, max=4000000)
image_url = lambda: it_faker.lexify(f"{BASE_URL}??????????????????.png")


def lst(factory_, min=0, max=20):
    return [factory_() for _ in range(it_faker.random_int(min=min, max=max))]


@dataclass
class Skill:
    name: str = f(lambda: it_faker.text(max_nb_chars=20))
    id: int = f(random_id)


all_skills = [Skill() for _ in range(200)]


@dataclass
class PersonalInfo:
    cf: str = f(it_faker.ssn)
    name: str = f(student_faker.name)
    gender: str = f(lambda: it_faker.random_element(elements=('Male', 'Female', 'Other')))
    birthday: Optional[str] = f(lambda: it_faker.date_between(start_date="-50y", end_date="-18y"))


@dataclass
class Subject:
    name: str = f(it_faker.word)
    id: int = f(random_id)


all_subjects = [Subject() for _ in range(50)]


#### EXERCISES

class ExerciseType(Enum):
    MULTIPLE_CHOICE = "multipleChoice"
    IMAGE_QUESTION = "imageQuestion"
    IMAGE_CHOICE = "imageChoice"
    HANDWRITING = "handwriting"
    SPEAKING = "speaking"
    FREE_TEXT = "freeText"
    LISTENING = "listening"


@dataclass
class BaseExercise:
    exType: ExerciseType
    question: str = f(lambda: it_faker.sentence())


@dataclass
class MultipleChoiceExercise(BaseExercise):
    exType = ExerciseType.MULTIPLE_CHOICE
    options: List[str] = f(
        lambda: [it_faker.sentence() for _ in range(start=0, stop=it_faker.random_int(min=4, max=6))])
    correctIndex: int = f(lambda: it_faker.random_int(min=0, max=4))


BASE_URL = "https://cdn.sideducation.it/"


@dataclass
class ImageQuestionExercise(MultipleChoiceExercise):
    exType = ExerciseType.IMAGE_QUESTION
    imageUrl: str = f(image_url)


@dataclass
class ImageChoiceExercise(BaseExercise):
    exType = ExerciseType.IMAGE_CHOICE
    optionUrls: List[str] = f(lst(image_url, min=4, max=9))
    correctIndex: int = f(lambda: it_faker.random_int(min=0, max=4))


@dataclass
class HandWritingExercise(BaseExercise):
    exType = ExerciseType.HANDWRITING
    correctAnswer: str = f(it_faker.word())
    samples: List[str] = f(lst(image_url, min=2, max=4))

@dataclass
class SpeakingExercise(BaseExercise):
    exType = ExerciseType.SPEAKING



@dataclass
class Exercise:
    difficulty: str = f(lambda: it_faker.random_choice(elements=("Easy", "Medium", "Hard")))
    subject: Subject = f(lambda: it_faker.random_choice(elements=all_subjects))


# Evaluations and study plan assignments are same they exist on student
# We generate and embed exercises on students.


@dataclass
class Student:
    account_id: int = f(random_id)
    personal_info: PersonalInfo = f(PersonalInfo)
    skill_set: List[Skill] = f(lambda: it_faker.random_choices(elements=all_skills, length=10))
    evaluations: str = f(it_faker.text)
    tutorial_status: str = f(it_faker.text)
    exercise_attempts: str = f(it_faker.text)
    events: str = f(it_faker.text)
    study_plan: str = f(it_faker.text)


elems = [asdict(Student()) for _ in range(5)]
with open("test.json", "w") as file:
    json.dump(elems, file)

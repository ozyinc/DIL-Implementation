FROM python:3.7.10-alpine3.12
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY src src
CMD ["python", "src/main.py"]
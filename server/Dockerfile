FROM python:3.8.4

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

ENV FLASK_APP=tmx.py
ENV FLASK_RUN_HOST=0.0.0.0

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000
COPY . .

CMD ["flask", "run"]
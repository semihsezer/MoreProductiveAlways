FROM python:3.7

RUN mkdir -p /server
RUN apt-get update && apt-get install -y python-dev-is-python3
ENV PYTHONPATH=/server

WORKDIR /server
COPY server/requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY server /server
RUN python3 manage.py collectstatic --no-input


CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
#CMD ["uwsgi", "--ini", "uwsgi.ini", "--static-map", "/static=/server/static"]


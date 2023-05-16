FROM python:3.10

WORKDIR /src

ADD  /requirements.txt /

RUN pip3 install -r /requirements.txt
# RUN pip install --no-cache-dir --upgrade -r /requirements.txt

ADD /src /src
# COPY ./app /src/app
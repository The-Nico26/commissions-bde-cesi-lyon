FROM python

COPY requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

RUN apt-get update -y && apt-get install postgresql-client -y

COPY src /code
WORKDIR /code

RUN rm -rf /tmp/* && apt-get clean -y

ENTRYPOINT ["./prod-run.sh"]
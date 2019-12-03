#!/bin/bash

while ! pg_isready -U "$POSTGRES_USER" -h "$POSTGRES_HOST"; do
  echo "Waiting for postgres to be ready..."
  sleep 1
done

python manage.py migrate

python src/manage.py collectstatic

gunicorn bdecesi.wsgi --bind=0.0.0.0 $@
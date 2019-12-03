#!/bin/bash
set -e

while ! pg_isready -U "$POSTGRES_USER" -h "$POSTGRES_HOST"; do
  echo "Waiting for postgres to be ready..."
  sleep 1
done

IS_MIGRATING=true python manage.py migrate

python manage.py collectstatic

gunicorn bdecesi.wsgi --bind=0.0.0.0 $@
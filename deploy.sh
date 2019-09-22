#!/bin/bash

echo "Collecting static files"
ENVIRONMENT=development python src/manage.py collectstatic
rm -r proxy/static-files
mv src/static-files proxy/static-files

echo "Starting stack"
docker stack deploy --compose-file docker-compose.yml bde-cesi-lyon
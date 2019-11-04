#!/bin/bash
echo "checking out latest version"
git pull origin master

VERSION=$(git log --oneline | head -n 1 | cut -d' ' -f1)
export VERSION
echo "DEPLOYING version $VERSION"

echo "Collecting static files"
ENVIRONMENT=development python3 src/manage.py collectstatic
rm -r proxy/static-files
mv src/static-files proxy/static-files

docker build . -t epickiwi/bdecesi-django
docker build proxy -t epickiwi/bdecesi-proxy

echo "Starting stack"
docker stack deploy --compose-file docker-compose.yml bde-cesi-lyon

echo "Cleaning old containers"
docker ps | grep "bde-cesi-lyon_" | grep -v "_db" | cut -d' ' -f1 | xargs docker rm -f
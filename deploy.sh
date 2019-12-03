#!/bin/bash
set -e

echo "checking out latest version"
git pull origin master

VERSION=$(./get_version.sh)
export VERSION
echo "DEPLOYING version $VERSION"

docker build . -t epickiwi/bdecesi-django
docker build proxy -t epickiwi/bdecesi-proxy
docker build post-quester -t epickiwi/post-quester

echo "Starting stack"
docker stack deploy --compose-file docker-compose.yml bde-cesi-lyon

echo "Cleaning old containers"
docker ps | grep "bde-cesi-lyon_" | grep -v "_db" | cut -d' ' -f1 | xargs docker rm -f
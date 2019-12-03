FROM node

RUN mkdir /code

COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json

RUN cd /code && npm i

COPY src /code/src

WORKDIR /code

ENTRYPOINT ["npm", "run", "start"]
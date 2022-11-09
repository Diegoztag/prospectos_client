FROM node:14.15.0
MAINTAINER Diego Zazueta <diego.zazueta@coppel.com>

RUN apt-get update || : && apt-get install python -y

RUN mkdir /home/app

COPY ["package.json", "/home/app"]

WORKDIR /home/app

RUN npm config set registry https://registry.coppel.io/repository/npm/

RUN npm install -g @angular/cli

RUN npm install --legacy-peer-deps

COPY . /home/app

CMD npm run dev

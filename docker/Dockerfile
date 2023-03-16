# syntax=docker/dockerfile:1
FROM node:17.9.1-alpine
ENV SHELL = /bin/bash
ENV PYTHONBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
RUN apk update && apk add rsync openssh git nodejs npm bash curl sqlite npm
RUN mkdir /Work
COPY social-index-search-engine /Work
WORKDIR /Work
RUN npm install
RUN node src/database/dbstarter.js
EXPOSE 3000
# syntax=docker/dockerfile:1
FROM node:12-alpine
ENV SHELL = /bin/bash
RUN apk update && apk add rsync openssh git nodejs npm bash curl sqlite
RUN npm i -D webpack@latest
RUN npm install -g bash
COPY social-index-search-engine ./
EXPOSE 3000
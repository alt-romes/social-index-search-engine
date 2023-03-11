# syntax=docker/dockerfile:1
FROM node:19-alpine
ENV SHELL = /bin/bash
RUN apk update && apk add rsync openssh git nodejs npm bash curl sqlite
COPY social-index-search-engine ./
EXPOSE 3000
CMD npm install
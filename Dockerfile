FROM node:current-alpine

WORKDIR /home/node/app/

COPY package.json .
COPY build ./build
RUN npm install --omit=dev

CMD CONTAINER=yes node build/index.js
FROM node:current-alpine

WORKDIR /home/node/app/

COPY package.json .
COPY build ./build
RUN npm install --omit=dev

CMD node build/index.js
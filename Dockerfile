FROM node:18-alpine

EXPOSE 3000

RUN apk update && apk add bash
RUN apk add --no-cache bash

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN chmod +x node_modules/.bin/next
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
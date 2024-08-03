FROM node:20

COPY . /client

WORKDIR /client

RUN npm install --production

EXPOSE 3000

CMD npm start
FROM node:14

COPY . /src

WORKDIR /src

#COPY initializedb.js /app

RUN npm install --production

EXPOSE 3000

CMD npm start
"use strict";

var host = 'localhost';
var DB_URI = "mongodb://" + host + ":27017/WSIE";

if (process.env.MONGO_DB_UI) {
  DB_URI = process.env.MONGO_DB_UI;
}

module.exports = {
  DB_URI: DB_URI
};
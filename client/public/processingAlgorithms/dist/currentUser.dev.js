"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setUserData = setUserData;
exports.getUserData = getUserData;
var userData = null;

function setUserData(data) {
  userData = data;
}

function getUserData() {
  return userData;
}
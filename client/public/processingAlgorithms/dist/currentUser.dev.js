"use strict";

var UserModule = UserModule || {};
UserModule.userData = null;

UserModule.setUserData = function (data) {
  UserModule.userData = data;
};

UserModule.getUserData = function () {
  return UserModule.userData;
};

window.UserModule = UserModule;
let userData = null;

function setUserData(data) {
  userData = data;
}

function getUserData() {
  return userData;
}

export { setUserData, getUserData };
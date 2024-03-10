const host = 'http://localhost:8080';

async function getUserId(username){
  try {
      const response = await fetch(`${host}/api/v1/users/findUserId?username=${username}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });
      if (response.status != 200) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
  } 
  catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return "";
  }
}

async function getUserData(username){
  try {
      const response = await fetch(`${host}/api/v1/users/findUserData?username=${username}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });
      if (response.status != 200) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
  } 
  catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return "";
  }
}

function getUserNameFromCookie() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; userName=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}


function getUserObject(username){
    fetch(`${host}/api/v1/users/findUser/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.status != 200) {
          throw new Error('Cannot find user');
        }
        return response.json();
      })
      .then(user => {
        console.log('User found: ', user);
        return user;
        
      })
      .catch(error => {
        console.error('Fetch error: ', error);
      });
}

if(typeof module === 'object'){
  module.exports = {
    getUserId,
    getUserData,
    getUserNameFromCookie,
    getUserObject
  }
}
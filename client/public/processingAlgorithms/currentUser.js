const host = 'localhost:8080';

async function getUserId(username){
  try {
      const response = await fetch(`http://${host}/api/v1/users/findUserId?username=${username}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });
      if (!response.ok) {
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
      const response = await fetch(`http://${host}/api/v1//users/findUserData?username=${username}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });
      if (!response.ok) {
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


function getUsername(){
  const urlString = window.location.href;
  const url = new URL(urlString);
  const username = url.searchParams.get('name');
  console.log(username);
  return username;
}
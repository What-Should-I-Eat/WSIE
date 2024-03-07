const host = 'http://localhost:8080';

// async function getUserId(username){
//   try {
//     console.log('i am here');
//       const response = await fetch(`${host}/api/v1/users/findUserId?username=${username}`, {
//           method: 'GET',
//           headers: {
//               'Content-Type': 'application/json',
//           },
//       });
//       if (response.status != 200) {
//           throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       return data;
//   } 
//   catch (error) {
//       console.error('There was a problem with the fetch operation:', error);
//       return "";
//   }
// }

// async function getUserData(username){
//   try {
//     console.log("is this being called?");
//       const response = await fetch(`${host}/api/v1/users/findUserData?username=${username}`, {
//           method: 'GET',
//           headers: {
//               'Content-Type': 'application/json',
//           },
//       });
//       if (response.status != 200) {
//           throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       return data;
//   } 
//   catch (error) {
//       console.error('There was a problem with the fetch operation:', error);
//       return "";
//   }
// }


// function getUsername(){
//   const urlString = window.location.href;
//   const url = new URL(urlString);
//   const username = url.searchParams.get('name');
//   console.log(username);
//   return username;
// }

// function getUserObject(username){
//     fetch(`${host}/api/v1/users/findUser/${username}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Cannot find user');
//         }
//         return response.json();
//       })
//       .then(user => {
//         console.log('User found: ', user);
//         return user;
        
//       })
//       .catch(error => {
//         console.error('Fetch error: ', error);
//       });
// }
# What Should I Eat? Documentation

## Overview
What Should I Eat? is a web and iOS mobile application dedicated to assisting people with dietary restrictions with finding diverse food to make and eat. 

## Run the Web Application Version
After cloning, run `npm install` in the root, client, and server directories.

Ensure Docker Desktop is available. Use the following commands to run the application in the root directory:

`docker compose build`

`docker compose up`

This will build and start the 4 Docker containers of the root directory:
1. `db-1`
2. `server-1`
3. `client-1`
4. `nginx-1`

Navigate to `http://localhost:8080` to begin using the application. 

To end the Docker containers, run `docker compose down` in the root directory.

## Client

### User Perspective
Once an existing user is successfully logged in (or a new user is created then logs in), the application redirects to that user's profile page, where dietary restrictions may be selected. Available dietary restricitons include popular diets, religious diets, and allergies. Currently, these restrictions are constrained by the available restrictions from the Edamam API. 

After choosing dietary restrictions, the user may navigate to the Search tab, where they can search any food or recipe. Displayed results adhere to the user's selected dietary restrictions. Upon selecting a recipe from the results, the user will be presented with the list of ingredients and directions for that recipe. A heart icon will appear next to the recipe's name, which the user may click if they want to "favorite" that recipe.

Favorited recipes appear in the Favorites tab. The user can browse their favorited recipes there.

In total, there are four tabs that the user may interact with. The fourth tab enables the user to log out of the application and be redirected to the login page. 

### Developer Perspective
The client uses the Fetch API to access server endpoints which provide the functionality of the application. The iOS mobile version of the application was created by using Ionic's Capacitor framework. No frameworks were used for the UI of the application. Javascript files corresponding to each HTML page can be found in the `processingAlgorithms` subdirectory inside the client. For continuity, the current user's username is passed in the URL of each HTML page.

#### New User Signup and Existing User Login
Data persistence now exists on reboot of server. When a new user signs up, a unique username and email must be provided. Additionally, the user must input their chosen password twice.

## Server

### Endpoints

The server contains three categories of endpoints: user endpoints, Edamam API endpoints, and web scraping endpoints. Each category contributes to different functionality within the application.

#### User Endpoints
##### Pre-Authentication Access
The following endpoints provide functionality related to users of the application and interact with the database. 

`POST /users/register`: Allows new users to create an account and returns the newly registered user's account. 
`POST /users/find-username`: Finds a user by username and validates the inputted password. After successful authentication, sets up session data and cookies and returns the user object from the database. 

##### Authentication or User Session Required to Access
`GET /users/profile`: Fetches a user's profile if that user is logged in.

`GET users/findUserData`: Gets user data based on the username of the current user.

`GET /users`: Returns a JSON array of all users.

`GET /users/findUserId`: Returns the `_id` parameter of a user.

`DELETE /users/:id`: Deletes a user by their user ID.

`PUT /users/diet`: Updates a user's diet restrictions.

`PUT /users/health`: Updates a user's health restrictions.

`PUT /users/:id/favorites`: Adds a recipe to a user's favorited recipes.

`DELETE /users/:id/favorites`: Removes a recipe from a user's favorited recipes

`POST /users/:id/favorites`: Returns true if recipe is in favorites already, false otherwise. 

#### Edamam API Endpoints
`GET /edamam`: Returns the Edamam API access link for this application.

#### Scraping Endpoints
`GET /scrape-recipe`: Accepts query parameters of Edamam recipe link and Edamam recipe source. Calls `determineSite()` which determines the site of origin and creates a scraper for the recipe directions in that site. `determineSite()` calls `getRecipeDirectionsFromSource()`, which gets the text content of the recipe directions on the respective site. Recipe data is ultimately returned as a JSON object to `/scrape-recipe`.

### Models
#### UserSchema
`UserSchema`, located inside `userModel.js`, defines a schema for a User object inside the database. 

`UserSchema` contains the following fields:
* `_id` (String): Randomly generated identifier for a user.
* `fullName` (String): User's full name.
* `userName` (String): User's chosen username.
* `password` (String): User's chosen password that is stored as a hashed password via bcrypt framework.
* `email` (String): User's email address.
* `diet` (String array): Array containing user's dietary selections (these identifiers follow query parameters passed to Edamam API).
* `health` (String array): Array containing user's health selections (these identifiers follow query parameters passed to Edamam API).
* `favorites` (object array): Array of objects representing recipes that the user has favorited.
  - `_id` (String): Randomly generated identifier for the favorited recipe.
  - `recipeName` (String): Name of the recipe.
  - `recipeIngredients` (String array): Array of recipe ingredients.
  - `recipeDirections` (String array): Array of recipe directions.
  - `recipeImage` (String): URL to the recipe image (from Edamam API response).
  - `recipeUri` (String): URL to the recipe's location in the Edamam API.
   
`userModel.js` also contains a helper method for password validation.

### Server Setup
`server.js` and `app.js` set up middleware and provide logic for connection to the database.

## Database
The database is a NoSQL MongoDB called `WSIE` (What Should I Eat?). It contains one collection called `Users`. 

## Nginx
Nginx is used as a reverse proxy and enables both the client and server to be accessed via a single host variable, which is currently set to `localhost:8080`. Internally, the client runs on port `3000` and the server runs on port `3001`.

## Software Architecture
The following diagram shows the software architecture of the application.

![Alt text](<Architecture.jpg>)

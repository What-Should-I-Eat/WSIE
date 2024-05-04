# What Should I Eat? Documentation

## Overview

What Should I Eat? is a web application dedicated to assisting dietary restricted people with finding diverse food to make and eat.

## Run the Application via the Web

Navigate to http://whatshouldieat.org to begin using the application.

## Run the Application Locally

After cloning, run `npm run install-all` in the root directory.

Ensure Docker Desktop and the Docker CLI are available locally. Use the following commands to run the application in the root directory:

`npm start`

This command will run `docker compose down`, `docker compose build`, and `docker compose up` in sequence. Alternatively, one can individually run:

`docker compose build`

`docker compose up`

Both methods will build and start the 4 Docker containers of the root directory:

1. `db-1`
2. `server-1`
3. `client-1`
4. `nginx-1`

Navigate to `http://localhost:8080` to begin using the application.

To end the Docker containers, run `docker compose down` in the root directory.

## Client

### User Perspective

A new user selects the link to sign up for the application, and inputs a full name, email, username, and password. A verification code is sent to the new user's email, which is inputted in the verification code input box. Once a new user is verified, they may log in to the application.

After logging in, the application redirects to the user's profile page, where dietary restrictions may be selected. Available dietary restricitons include popular diets, religious diets, and allergies. Currently, these restrictions are constrained by the available restrictions from the Edamam API.

After choosing dietary restrictions, the user may navigate to the Search tab, where they can search any food or recipe. Displayed results adhere to the user's selected dietary restrictions. Upon selecting a recipe from the results, the user will be presented with the list of ingredients and directions for that recipe. A heart icon will appear next to the recipe's name, which the user may click if they want to "favorite" that recipe.

Favorited recipes appear in the Favorites tab. The user can browse their favorited recipes there.

In total, there are four tabs that the user may interact with. The fourth tab enables the user to log out of the application and be redirected to the login page, which contains links to new user signup and forgot password.

If a user forgets their password upon attempting to log in, they may enter their email to receive a new verification code which is used to reset the password.

### Developer Perspective

The client uses the Fetch API to access server endpoints which provide the functionality of the application. No frameworks were used for the UI of the application. Javascript files corresponding to each HTML page can be found in the `processingAlgorithms` subdirectory inside the client.

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

`GET /users/getVerificationCode`: Returns random 6-digit code for account verification.

`DELETE /users/:id`: Deletes a user by their user ID.

`PUT /users/diet`: Updates a user's diet restrictions.

`PUT /users/health`: Updates a user's health restrictions.

`PUT /users/:id/favorites`: Adds a recipe to a user's favorited recipes.

`DELETE /users/:id/favorites`: Removes a recipe from a user's favorited recipes

`POST /users/:id/favorites`: Returns true if recipe is in favorites already, false otherwise.

`POST /users/getUserEmail`: Returns user's email based on username.

`PUT /users/verify`: Updates a user's account verification status.

`PUT /resendVerificationCode`: Updates and resends a user's verification code while also resetting the code expiration time.

#### Edamam API Endpoints

`GET /edamam`: Returns the Edamam API access link for this application.

#### Scraping Endpoints

`GET /scrape-recipe`: Accepts query parameters of Edamam recipe link and Edamam recipe source. Calls `determineSite()` which determines the site of origin and creates a scraper for the recipe directions in that site. `determineSite()` calls `getRecipeDirectionsFromSource()`, which gets the text content of the recipe directions on the respective site. Recipe data is ultimately returned as a JSON object to `/scrape-recipe`.

### Models

#### UserSchema

`UserSchema`, located inside `userModel.js`, defines a schema for a User object inside the database.

`UserSchema` contains the following fields:

- `_id` (String): Randomly generated identifier for a user.
- `fullName` (String): User's full name.
- `userName` (String): User's chosen username.
- `password` (String): User's chosen password that is stored as a hashed password via bcrypt framework.
- `email` (String): User's email address.
- `verified` (Boolean): User's account has been verified or not.
- `verificationCode` (String): 6-digit verification code that is sent to the User's email and is stored as a hashed value via bcyrpt framework.
- `verificationCodeTimestamp` (Date): Timestamp of when verification was sent (helps confirm code is past its 10 minute experiation)
- `incorrectPasswordAttempts` (Number): Documents number of consecutive incorrect password attempts a user makes prior to logging in or restting password; after 5 incorrect attemps in a row, there is a 10 minute account lockout; after 10 total incorrect attempts in a row, the user must reset his/her password
- `incorrectPasswordAttemptTime` (Date): Used in conjunction with incorrectPasswordAttempts to assist in account lockout as applicable
- `diet` (String array): Array containing user's dietary selections (these identifiers follow query parameters passed to Edamam API).
- `health` (String array): Array containing user's health selections (these identifiers follow query parameters passed to Edamam API).
- `favorites` (object array): Array of objects representing recipes that the user has favorited.
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

The database is a NoSQL MongoDB called `WSIE` (What Should I Eat?). It contains one collection called `Users`, which contains all data associated with registered users of the application.

## Nginx

Nginx is used as a reverse proxy and enables both the client and server to be accessed via a single host variable, which is set to `8080` in the local verion (branch `main`) and to the IP address of the virtual machine that hosts the deployed version (branch `new-deployable`). Internally, the client runs on port `3000` and the server runs on port `3001`.

## Testing

The testing of our application relies on the JavaScript testing framework `Jest`. We also leverage `jsdom` for HTML related testing and `supertest` for server endpoint testing.
To observe the test suite performance, run:

`npm test`

This action will return a coverage report, including statement, branch, function, and line coverage information, as well as the total number of tests and test suites ran.

## Hosting

The browser-accessible hosted version of the application is hosted on a Google Cloud Platform virtual machine. The virtual machine runs the Docker containers and Nginx references the public IP address of the virtual machine for client-server communication. The DNS, GoDaddy, aliases the public IP address's port `8080` to allow the whatshouldieat.org URL to access the application. This is not a full CI/CD solution.

## Software Architecture

The following diagram shows the software architecture of the application.

![Alt text](<WSIE Architecture-2.jpg>)

## Additional Software

- [Install NPM](https://nodejs.org/en/download)
- [Install Mongo](https://www.mongodb.com/docs/manual/administration/install-community/)
- [Install Docker](https://docs.docker.com/engine/install/)

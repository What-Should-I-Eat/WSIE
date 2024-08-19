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

## Server

### Setup

`server.js` and `app.js` set up middleware and provide logic for connection to the database.

### Endpoints

The server contains four routes for different endpoints:

- [contact.js](server/routes/contact.js): Handles all interaction with the "Contact Us" Page
- [private.js](server/routes/private.js): Handles all interactions from the point after a user is logged in
- [public.js](server/routes/public.js): Handles all interactions from before a user is logged in
- [scrape.js](server/routes/scrape.js): Handles scraping of recipe instructions

### Models

The database of choice for WSIE is MongoDB and contains four different collections:

- [contactUsModel.js](server/src/models/contactUsModel.js): Stores all messages submitted by users
- [recipeModel.js](server/src/models/recipeModel.js): Stores all recipes models - both user created and from edamam
- [recipePubRequestModel.js](server/src/models/recipePubRequestModel.js): Stores all recipe publish requests for the public
- [userModel.js](server/src/models//userModel.js): Stores all the user information

## Nginx

Nginx is used as a reverse proxy and enables both the client and server to be accessed via a single host variable, which is set to `8080` in the local verion (branch `main`) and to the IP address of the virtual machine that hosts the deployed version (branch `new-deployable`). Internally, the client runs on port `3000` and the server runs on port `3001`.

## Testing

The testing of our application relies on the JavaScript testing framework `Jest`. We also leverage `jsdom` for HTML related testing and `supertest` for server endpoint testing.
To observe the test suite performance, run:

`npm test`

This action will return a coverage report, including statement, branch, function, and line coverage information, as well as the total number of tests and test suites ran.

## Hosting

The browser-accessible hosted version of the application is hosted on a Google Cloud Platform Virtual Machine. The virtual machine runs the Docker containers and Nginx references the public IP address of the virtual machine for client-server communication. The DNS, GoDaddy, aliases the public IP address's port `8080` to allow the [whatshouldieat.org](http://whatshouldieat.org) URL to access the application. This is not a full CI/CD solution.

## Software Architecture

The following diagram shows the software architecture of the application.

![Alt text](<WSIE Architecture-2.jpg>)

## Additional Software

- [Install NPM](https://nodejs.org/en/download)
- [Install Mongo](https://www.mongodb.com/docs/manual/administration/install-community/)
- [Install Docker](https://docs.docker.com/engine/install/)

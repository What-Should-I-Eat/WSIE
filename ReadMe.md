# What Should I Eat? Initial Documentation

## Overview
What Should I Eat? is in its initial stages. The application contains a client, server, and database, but the client is not built out. API endpoints in the server are the main focus currently, then the database will be expanded before building out the client.

## To Run
Use the following commands to run the application:

`docker compose build`

`docker compose up`

This will build and start the 5 docker containers of `testapp`:
1. `initialize-db-1`
2. `db-1`
3. `server-1`
4. `client-1`
5. `nginx-1`

When the application starts, all 5 containers will run, then `initialize-db-1` will end immediately after loading data into `db-1`. All URIs run on `localhost:8080` via NGINX and data can be accessed via the endpoints described in the Server section.

## Client
The client doesn't really do anything right now. You can search a recipe and it will show options with links. It can be accessed at `localhost:8080`.

## Server
The server contains the following API endpoints: 
* `/`: does nothing except tells us that the server is up and running.
* `/api/v1/ingredients`: displays JSON array of ingredients from `WSIE` database.
* `/api/v1/restrictions`: displays JSON array of dietary restrictions from `WSIE` database.
* `/api/v1/search-simply-recipes/:searchQuery`: returns JSON array of recipe names and links to recipe pages based on an encoded search parameter.
* `/api/v1/scrape-recipe`: displays JSON array of ingredients and recipe instructions for a specific recipe. Currently, this endpoint is hard coded to return a recipe for tomato soup, but later it will accept a link from the `search-simply-recipes` endpoint to display a recipe that the user selects.

All of these endpoints can be accessed at `localhost:8080`.


## Database
The database is a NoSQL MongoDB called `WSIE` (What Should I Eat?). It contains two collections: `restrictions` and `ingredients`. `restrictions` contains common dietary restrictions (i.e. peanut allergy, lactose intolerance, etc.). `ingredients` contains a list of ingredients, their associated dietary restrictions tags, and alternatives for the ingredient. These collections contain the data loaded by `initialize-db-1` when the program is run.

Currently, the database only contains test data. Data can be accessed at `localhost:8080/api/v1/ingredients` and `localhost:8080/api/v1/restrictions`.
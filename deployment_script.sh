#!/bin/bash

# Deployment script

# Define the Docker command to run
command_to_run="up"  # Change this to "down", "build", or any other desired command

case "$command_to_run" in
    down)
        echo "Running docker-compose down..."
        docker-compose down
        ;;
    build)
        echo "Running docker-compose build..."
        docker-compose build
        ;;
    up)
        echo "Running docker-compose up..."
        docker-compose up
        ;;
    *)
        echo "Invalid command. Please enter ~up~ to start docker containers."
        ;;
esac

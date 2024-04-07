#!/bin/bash

# Get current date and time
current_time=$(date +"%Y-%m-%d_%H-%M-%S")

# Define the directory where you want to store the dump
dump_dir="./backups/$current_time"

# Create the directory if it doesn't exist
# mkdir -p "$dump_dir"


echo $mongodb_uri

# Run mongodump with the desired parameters
mongodump --out $dump_dir  --uri=$1 --db=db
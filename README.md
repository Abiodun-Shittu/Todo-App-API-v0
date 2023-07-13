# Todo-App-API
This repository contains the source code and documentation for a Todo App RESTful API built with Express.js and PostgreSQL. The API provides endpoints for user authentication and managing user profiles, as well as creating, fetching, updating, and deleting todos. The API includes an authorization middleware to ensure that each user can only manage their own todos.

## Requirements
To run this Todo App API, you need the following:
- Node.js runtime
- npm or Yarn package manager
- PostgreSQL database

## Features
The Todo App API includes the following features:
- Built with Express.js, a Node.js framework
- User authentication for creating, fetching, updating, and deleting user profiles
- CRUD operations for managing todos
- Authorization middleware to ensure users can only manage their own todos
- Uses PostgreSQL as the database for storing user profiles and todos

## Installation
To install and set up the Todo App API, follow these steps:
- Clone the repository: `git clone repo-link`
- Navigate to the project folder: `cd project-folder`
- Install the dependencies: `npm install`
- Setup environment variable - `cp .env.example .env`
- Start the server: `npm start`

## API Endpoints
The Todo App API provides the following endpoints:
### User Authentication:
- POST /api/v0/users: Register a new user
- POST /api/v0/users/login: Login an existing user
### User Profile:
- GET /api/v0/users/:id: Get the authenticated user's profile
- PATCH /api/v0/users/:id: Update the authenticated user's profile
- DELETE /api/v0/users/:id: Delete the authenticated user's profile
### Todos:
- GET /api/v0/todos: Get all todos for the authenticated user
- POST /api/v0/todos: Create a new todo for the authenticated user
- GET /api/v0/todos/:id: Get a specific todo by ID for the authenticated user
- PATCH /api/v0/todos/:id: Update a specific todo by ID for the authenticated user
- DELETE /api/v0/todos/:id: Delete a specific todo by ID for the authenticated user

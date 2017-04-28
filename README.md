[![Code Climate](https://codeclimate.com/github/andela-eshaibu/document_management_system/badges/gpa.svg)](https://codeclimate.com/github/andela-eshaibu/document_management_system)
[![Build Status](https://travis-ci.org/andela-eshaibu/document_management_system.svg?branch=develop)](https://travis-ci.org/andela-eshaibu/document_management_system)
[![Coverage Status](https://coveralls.io/repos/github/andela-eshaibu/document_management_system/badge.svg?branch=develop)](https://coveralls.io/github/andela-eshaibu/document_management_system?branch=develop)

# Document Management System
The Document management system is a system that manages documents with types, users and user roles. 
Each document defines access rights; the document defines which roles can access it. Also, each document specifies the date 
it was published. It allows create, retrieve, update and delete actions to be carried out. It also ensures that users are authorized.

## Technologies and Services

### Written in Javascript es6 syntax and nodejs on the backend, with the following:

* Mocha
* Webpack
* React Redux
* Travic CI
* Coveralls
* Hound CI
* HTML/CSS
* Sequelize
* Express


## Contributions

* Clone the repository.
* Install dependencies
* Create a new branch for included feature(s) using the keyword feature/ example `feature/new-feature`.
* Raise a pull request.

## Application Features
###### User Authentication
Users are authenticated and validated using JWT tokens.

###### Document Management
*   Create an account
*   Login with your credentials
*   Create new document with specifying document title, content and document access
*   Edit Documents
*   Delete documents
*   View public documents created by other users.
*   View documents created by his access group with access level set as `role`.
*   Search a users public documents.
*   View `public` and `role` access level documents of other regular users.
*   Logout

-   In addition to the general user functions, an admin user can:
    -   View all users.
    -   View all created documents except documents with access set to private.
    -   Delete any user.
    -   Update any user's record.
    -   Create a new role.
    -   View all created roles.
    -   Search for any user.

## Installation
-   Install NodeJs and Postgres on your machine
-   Clone the repository `$ git clone https://github.com/andela-eshaibu/document_management_system.git`
-   Change into the directory `$ cd /document_management_system`
-   Install all required dependencies with `$ npm install`
-   Create a `.env` file in your root directory and follow the pattern in the .env.sample file to create environmental variables

## Usage
-   Migrate your database by running this command `npm run db_migrate`
-   Seed your database by running this command `npm run db_seed`, this seeds admin and regular roles, and superadmin user.
-   Run `npm start` to start the application

## Testing
-   Run Test `npm test`
-   You can undo your migrations by running this command `npm run db:migrate:test:undo`.

` Use separate DB's for testing and development `

## API Documentation
-----
The API has routes, each dedicated to a single task that uses HTTP response codes to indicate API status and errors.
#### API Features

The following features make up the Document Management System API:

###### Authentication
-   It uses JSON Web Token (JWT) for authentication.

-   It generates a token on successful login or account creation and returns it to the consumer.

-   It verifies the token to ensures a user is authenticated to access protected endpoints.

###### Users

-   It allows users to be created.

-   It allows users to login and obtain a token

-   It allows the admin to manage users.

###### Roles

-   It ensures roles can be created, retrieved, updated and deleted by an admin user.
-   A non-admin user cannot create, retrieve, modify, or delete roles.
-   it allows for assignment of roles to users

###### Documents

-   It allows new documents to be created by authenticated users.

-   It ensures all documents are accessible based on the permission specified.

-   It allows admin users to create, retrieve, modify, and delete documents.


-   It ensures users can delete, edit and update documents that they own.

-   It allows users to retrieve all documents they own as well as public documents.

###### Search

-   It allows users to search public documents and documents they own for a specified search term.

-   It allows admin to retrieve all documents that matches search term.

-   It allows admin to search users based on a specified search term

#### Available API Endpoints and their Functionality

EndPoint                            |   Functionality
------------------------------------|------------------------
POST /api/v1/users/login            |   Logs a user in.
POST /api/v1/users                  |   Creates a new user.
GET /api/v1/users                   |   Find matching instances of user.
GET /api/v1/users/:id               |   Find user.
PUT /api/v1/users/:id               |   Update user attributes.
DELETE /api/v1/users/:id            |   Delete user.
POST /api/v1/documents              |   Creates a new document instance.
GET /api/v1/documents               |   Find matching instances of document.
GET /api/v1/documents/:id           |   Find document.
PUT /api/v1/documents/:id           |   Update document attributes.
DELETE /api/v1/documents/:id        |   Delete document.
GET /api/v1/users/:id/documents     |   Find all documents belonging to the user.
GET /api/v1/search/users?q=:phrase  |   Gets all users with username contain the search term
GET /api/v1/search/documents?q=:d   |   Get all documents with title containing the search query
GET /api/v1/roles                   |   Get all roles
POST /api/v1/roles                  |   Creates a new role
DELETE /api/v1/roles/:id            |   Deletes role
GET /api/v1/roles/:id               |   Find role
POST /api/v1/users/:id/password     |   Change password
PUT /api/v1/roles/:id               |   Edit Role

## API Documentation Link
- [view the api documentation](https://e-docman.herokuapp.com/documentation)
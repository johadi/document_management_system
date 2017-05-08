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
-   Migrate your database by running this command `npm run db_migrate`
-   You can undo your migrations by running this command `npm run db:migrate:test:undo`.
-   Seed your database by running this command `npm run db_seed`, this seeds admin and regular roles, and superadmin user.
-   Run `npm start` to start the application

## Testing
-   Run Test `npm test`

` Use separate DB's for testing and development `

# Contributions

* Clone the repository.
* Install dependencies
* Create a new branch for included feature(s) using the keyword feature/ example `feature/new-feature`.
* Raise a pull request.


## API Documentation Link
- [view the api documentation](https://e-docman.herokuapp.com/documentation)
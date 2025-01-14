# Bookscape Book Finder - A Google Books Search and Save App

## Overview

Bookscape Book Finder is a MERN-stack application that allows users to search for books using the Google Books API and save them to their personal library. Users can create accounts, log in, and manage their saved books.

## Table of Contents
- [Features](#features)
- [Deployed Website](#deployed-website)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Apollo Server](#apollo-server)
- [Future Developments](#future-developments)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)


## Features

- Search: Search for books using keywords.

- Save: Save books to a personal library.

- Manage: View and delete saved books.

- Authentication: Secure login and signup system with JWT.

- GraphQL API: Replaced RESTful API with Apollo Server for queries and mutations.

## Deployed Website

To view the deployed website, please visit (insert website here.)

## Tech Stack

- Frontend: React, Vite, Bootstrap

- Backend: Node.js, Express.js, MongoDB, Apollo Server

- Database: MongoDB Atlas

- Deployment: Render

## Installation

Pre-requisites

- Node.js (v16 or later)

- MongoDB Atlas account

Clone the Repository

```md
git clone https://github.com/omgxlori/bookscape.git
cd bookscape
```

Set Up Environment Variables

Create a .env file in the root directory and add the following:

```md
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET_KEY=<your-secret-key>
PORT=3001
REACT_APP_API_URL=https://<your-deployed-url>/api
```

Install Dependencies

Install dependencies for both client and server:

```md
npm install && npm run build --prefix client && npm run build --prefix server
```

## Running the Application Locally

Start the Server:

```md
cd server
npm run start
```

Start the Client:

```md
cd client
npm run dev
```

Visit http://localhost:3000 to access the app.

## Deployment

The application is deployed on Render. The client and server are built and deployed together.

Deployment Steps

Push changes to the main branch of the GitHub repository.

Ensure the correct environment variables are set in Render.

Verify that the deployment succeeds and the application is live.

API Endpoints

Queries

me: Returns the logged-in user's data.

Mutations

login: Logs in a user.

addUser: Creates a new user.

saveBook: Saves a book to the user's library.

removeBook: Removes a book from the user's library.

## Roadmap

Add advanced search filters (e.g., by author, genre).

Implement book categories for better organization.

Improve UI/UX with additional animations and feedback.

## License

This project is licensed under the MIT License.
# Bookscape Book Finder - A Google Books Search and Save App

## Overview

Bookscape Book Finder is a MERN-stack application that allows users to search for books using the Google Books API and save them to their personal library. Users can create accounts, log in, and manage their saved books.

## Table of Contents
- [Features](#features)
- [Deployed Website](#deployed-website)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the Application Locally](#running-the-application-locally)
- [GraphQL Queries and Mutations](#graphql-queries-and-mutations)
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

To view the deployed website, please visit https://bookscape-c4np.onrender.com/

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
npm i
npm run build
npm run start
```

Start the Client:

```md
cd client
npm i
npm run build
npm run dev
```

Visit http://localhost:3000 to access the app.

## GraphQL Queries and Mutations

To explore and test the queries and mutations available in this project, follow these steps:

1. Access Apollo Sandbox: https://studio.apollographql.com/sandbox/explorer

2. Go to the Settings tab and set the endpoint to:
https://bookscape-c4np.onrender.com//graphql

3. Add JWT Token in the Header
In the Headers section, add an Authorization header with the following format:
```md
Authorization: Bearer <your_jwt_token>
```
Replace <your_jwt_token> with the valid JWT token you received after logging in/creating an account.

4. Explore Queries and Mutations
Use the Explorer tab to run queries and mutations. Here are some examples:

Query Your Login Info

```md
query Query {
  me {
    username
    email
  }
}
```

View Saved Books
```md
graphql
Copy code
query Query {
  savedBooks {
    id
    authors
    title
    description
  }
}
```

Save a New Book
```md
mutation Mutation($book: BookInput!) {
  saveBook(book: $book) {
    id
    authors
    title
    description
  }
}
```

Delete a Book

```md
mutation Mutation($bookId: ID!) {
  deleteBook(bookId: $bookId) {
    id
    title
  }
}
```

## Future Developments

- Add advanced search filters (e.g., by author, genre).

- Implement book categories for better organization.

- Improve UI/UX with additional animations and feedback.

## Contributing
Feel free to open issues or submit pull requests. Contributions are welcome!

## Support
If you need help using this project or encounter issues, please reach out via the following options:

GitHub Issues: Report bugs or request features by opening an issue in the GitHub repository.
Email: Contact me at lbelovin@gmail.com for any inquiries.
You can also find more of my work at [https://github.com/omgxlori](https://github.com/omgxlori)

## License
This project is licensed under the MIT License. See the LICENSE file for details.
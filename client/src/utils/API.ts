import type { User } from '../models/User.js';
import type { Book } from '../models/Book.js';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://bookscape-c4np.onrender.com/api';

// route to get logged-in user's info (needs the token)
export const getMe = (token: string) => {
  return fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  });
};

export const createUser = (userData: User) => {
  return fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

export const loginUser = (userData: User) => {
  return fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

// save book data for a logged-in user
export const saveBook = (bookData: Book, token: string) => {
  console.log('📚 Sending book data to save:', bookData);

  return fetch(`${API_BASE_URL}/users/books`, {
    method: 'POST', // Ensure the backend is expecting POST
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  });
};

// remove saved book data for a logged-in user
export const deleteBook = (bookId: string, token: string) => {
  return fetch(`${API_BASE_URL}/users/books/${bookId}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

// make a search to google books api
export const searchGoogleBooks = (query: string) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};

import type { Request, Response } from 'express';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';

/** Get a single user by ID or username */
export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id || req.params.id;

    const foundUser = await User.findOne({
      $or: [{ _id: userId }, { username: req.params.username }],
    });

    if (!foundUser) {
      return res.status(400).json({ message: 'Cannot find a user with this id!' });
    }

    return res.json(foundUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/** Create a user, sign a token, and send it back */
export const createUser = async (req: Request, res: Response) => {
  try {
    console.log('🛡️ Received signup request:', req.body); // Log request data

    const user = await User.create(req.body);

    if (!user) {
      console.error('❌ Failed to create user');
      return res.status(400).json({ message: 'Something is wrong!' });
    }

    console.log('✅ User created successfully:', user);

    const token = signToken(user.username, user.email, String(user._id));
    console.log('✅ Token generated successfully:', token);

    return res.status(201).json({ token, user });
  } catch (err: any) {
    console.error('❌ Error in createUser:', err.message);

    // Handle specific errors
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error: ' + err.message });
    }

    return res.status(500).json({ message: 'Server error' });
  }
};


/** Login a user, sign a token, and send it back */
export const login = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (!user) {
      return res.status(400).json({ message: "Can't find this user" });
    }

    const correctPw = await user.isCorrectPassword(req.body.password);

    if (!correctPw) {
      return res.status(400).json({ message: 'Wrong password!' });
    }

    const token = signToken(user.username, user.email, String(user._id));
    return res.json({ token, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/** Save a book to a user's `savedBooks` field */
export const saveBook = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    console.log('📚 Book data received for saving:', req.body);

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $addToSet: { savedBooks: req.body } }, // Add book to savedBooks array
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: 'Could not save the book' });
    }

    console.log('✅ Book saved successfully:', updatedUser);
    return res.json(updatedUser);
  } catch (err) {
    const error = err as Error; // Type assertion
    console.error('❌ Error saving book:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};


/** Remove a book from `savedBooks` */
export const deleteBook = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: String(req.user._id) },
      { $pull: { savedBooks: { bookId: req.params.bookId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Couldn't find user with this id!" });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

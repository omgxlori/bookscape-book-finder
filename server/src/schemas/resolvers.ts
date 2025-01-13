import User from '../models/User.js';
import { signToken } from '../services/auth.js';

interface AuthenticatedUser {
  _id: string;
  username: string;
  email: string;
}

interface Context {
  user: AuthenticatedUser | null;
}

export const resolvers = {
  Query: {
    me: async (_: any, __: any, context: Context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await User.findById(context.user._id);
    },
  },
  Mutation: {
    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new Error('Invalid credentials');
      }
      const token = signToken(user.username, user.email, String(user._id));
      return { token, user };
    },
    addUser: async (_: any, { username, email, password }: any) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, String(user._id));
      return { token, user };
    },
  },
};

import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import type { ExpressContextFunctionArgument } from '@apollo/server/express4';
import { typeDefs } from './schemas/typeDefs.js';
import { resolvers } from './schemas/resolvers.js';
import { authMiddleware } from './services/auth.js';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/api/user-routes.js';

dotenv.config();

interface AuthenticatedUser {
  _id: string;
  username: string;
  email: string;
}

interface Context {
  user: AuthenticatedUser | null;
  req: ExpressContextFunctionArgument['req'];
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/users', userRoutes);

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';

mongoose.connect(uri)
  .then(() => {
    console.log('✅ MongoDB connected successfully');

    const server = new ApolloServer<Context>({
      typeDefs,
      resolvers,
    });

    async function startApolloServer() {
      await server.start();

      app.use(
        '/graphql',
        expressMiddleware(server, {
          context: async ({ req }: ExpressContextFunctionArgument): Promise<Context> => {
            const { user } = authMiddleware({ req });
            return { user, req };
          },
        })
      );

      app.listen(PORT, () => {
        console.log("🌍 Server is running on http://localhost:${PORT}");
        console.log("🚀 GraphQL Server ready at http://localhost:${PORT}/graphql");
      });
    }

    startApolloServer();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
  });
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
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/api/user-routes.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface AuthenticatedUser {
  _id: string;
  username: string;
  email: string;
}

interface Context {
  user: AuthenticatedUser | null;
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://bookscape-c4np.onrender.com'],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/users', userRoutes);

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
            return { user }; // Include only the user in the context
          },
        })
      );

      // Serve static files in production
      if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../../client/dist')));
        app.get('*', (_, res) => {
          res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
        });
      }

      app.listen(PORT, () => {
        console.log(`🌍 Server is running on http://localhost:${PORT}`);
        console.log(`🚀 GraphQL Server ready at http://localhost:${PORT}/graphql`);
      });
    }

    startApolloServer();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
  });

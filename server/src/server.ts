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
import path from 'path'; // Import path for serving static files

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

app.use(cors({ origin: '*', credentials: true })); // Adjust CORS for deployment
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

      // Serve React static files
      const reactBuildPath = path.join(__dirname, '../client/dist');
      app.use(express.static(reactBuildPath));

      // Catch-all route to serve React's index.html
      app.get('*', (req, res) => {
        res.sendFile(path.join(reactBuildPath, 'index.html'));
      });

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

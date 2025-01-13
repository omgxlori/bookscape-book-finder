import type { AuthenticatedUser } from '../../services/auth';

declare namespace Express {
  export interface Request {
    user?: AuthenticatedUser; // Ensure this matches the AuthenticatedUser type in auth.ts
  }
}

import { Router } from 'express';
import {
  getSingleUser,
  createUser,
  login,
  saveBook,
  deleteBook,
} from '../../controllers/user-controller.js';
import { authenticateToken } from '../../services/auth.js';

const router = Router();

router.route('/').post(createUser);
router.route('/login').post(login);
router.route('/me').get(authenticateToken, getSingleUser);
router.route('/books').post(authenticateToken, saveBook);
router.route('/books/:bookId').delete(authenticateToken, deleteBook);

export default router;

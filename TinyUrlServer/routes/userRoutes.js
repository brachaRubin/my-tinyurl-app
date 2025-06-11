import express from 'express';
import { protect } from '../middleware/auth.js';
import { restrictTo } from '../controllers/authController.js';
import {
  getCurrentUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserRole
} from '../controllers/userController.js';

const router = express.Router();

// All routes below are protected (require authentication)
router.use(protect);

// Get current user's profile
router.get('/me', getCurrentUser);

// Update current user's profile
router.patch('/update-me', updateUser);

// Delete current user's account
router.delete('/delete-me', deleteUser);

// Admin routes (protected + admin role required)
router.use(restrictTo('admin'));

// Get all users (admin only)
router.get('/', getAllUsers);

// Admin operations on specific user
router
  .route('/:id')
  .get(getUserById)
  .patch(updateUserRole)
  .delete(deleteUser);

export default router;
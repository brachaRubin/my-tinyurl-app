import User from '../models/user.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
// import { createSendToken } from './authController.js';

// Helper function to filter object fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
export const getCurrentUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+active +role');
  
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// @desc    Update current user
// @route   PATCH /api/users/update-me
// @access  Private
export const updateUser = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /update-password.',
        400
      )
    );
  }

  // 2) Filter out unwanted fields
  const filteredBody = filterObj(req.body, 'name', 'email', 'role');
  
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// @desc    Delete current user (soft delete)
// @route   DELETE /api/users/delete-me
// @access  Private
export const deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// @desc    Update user role (Admin only)
// @route   PATCH /api/users/:id
// @access  Private/Admin
export const updateUserRole = catchAsync(async (req, res, next) => {
  // 1) Filter out unwanted fields
  const filteredBody = filterObj(req.body, 'name', 'email', 'role');
  
  // 2) Update user document
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const adminDeleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
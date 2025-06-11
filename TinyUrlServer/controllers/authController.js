import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { promisify } from 'util';
import AppError from '../utils/appError.js';

// catchAsync is not defined in the provided code, so I'm assuming it's defined elsewhere
import catchAsync from '../utils/catchAsync.js';

const signToken = (user) => {
  if (!user || !user._id) {
    throw new Error('Invalid user object');
  }
  
  const role = user.role;
  console.log(role);
  console.log('Signing token for user:', { id: user._id, role });
  
  return jwt.sign(
    { id: user._id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user);  

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    if (err.code === 11000) {
      // Handle duplicate field (email) error
      const message = 'Email is already in use. Please use a different email or log in.';
      return next(new AppError(message, 400));
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password +role');
    console.log(user);

    if (!user || !(await user.comparePassword(password ))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

export const protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

// Restrict to certain roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log('=== restrictTo Middleware ===');
    console.log('Request user object:', JSON.stringify(req.user, null, 2));
    console.log('Available roles in request:', roles);
    console.log('User role from req.user:', req.user?.role);
    
    if (!req.user || !req.user.role) {
      console.log('No user or role found in request');
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    if (!roles.includes(req.user.role)) {
      console.log(`Access denied. User role '${req.user.role}' not in required roles:`, roles);
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    
    console.log('Access granted');
    next();
  };
};

// @desc    Create admin (admin only)
// @route   POST /api/auth/admin
// @access  Private/Admin
export const createAdmin = catchAsync(async (req, res, next) => {
  const newAdmin = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: 'admin'
  });

  // Don't send back the password
  newAdmin.password = undefined;

  res.status(201).json({
    status: 'success',
    data: {
      user: newAdmin
    }
  });
});
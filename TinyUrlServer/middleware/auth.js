import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import AppError from '../utils/appError.js';

export const protect = async (req, res, next) => {
  try {
    // 1) Get token and check if it's there
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

    // 2) Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); // Debug log
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return next(new AppError('Invalid token. Please log in again!', 401));
      }
      if (err.name === 'TokenExpiredError') {
        return next(new AppError('Your token has expired! Please log in again.', 401));
      }
      return next(err);
    }

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id).select('+role');
    console.log('Current user from DB:', JSON.stringify(currentUser, null, 2)); // Debug log
    
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
    // Create a plain object and explicitly set the role
    const userObj = {
      _id: currentUser._id,
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role, // Explicitly include the role
      id: currentUser._id.toString()
    };

    console.log('User object after creation:', JSON.stringify(userObj, null, 2));
    
    req.user = userObj;
    res.locals.user = userObj;
    next();
  } catch (err) {
    console.error('Error in protect middleware:', err); // Debug log
    next(err);
  }
};
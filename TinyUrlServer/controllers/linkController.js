import Link from '../models/link.js';
import User from '../models/user.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// Get all links for the current user
export const getMyLinks = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const links = await Link.find({ user: userId });
  
  res.status(200).json({
    status: 'success',
    results: links.length,
    data: {
      links
    }
  });
});

// Get a single link
export const getLink = catchAsync(async (req, res, next) => {
  const link = await Link.findOne({
    _id: req.params.id,
    user: req.user._id // Ensure the link belongs to the current user
  });

  if (!link) {
    return next(new AppError('No link found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      link
    }
  });
});

// Create a new link
// In linkController.js
export const createLink = catchAsync(async (req, res, next) => {
    const { originalUrl, targetValues = [] } = req.body;
    const userId = req.user._id;
  
    if (!originalUrl) {
      return next(new AppError('Please provide the original URL', 400));
    }
  
    // Create the link with initial target values
    const newLink = await Link.create({
      originalUrl,
      user: userId,
      targetValues, // Add initial target values
      targetParamName: 't' // Default parameter name is 't' for shorter URLs
    });
  
    // Add the link to user's links array
    await User.findByIdAndUpdate(
      userId,
      { $push: { links: newLink._id } }
    );
  
      // Create the short URL
      const shortUrl = `${req.protocol}://${req.get('host')}/${newLink._id}`;
  
      res.status(201).json({
        status: 'success',
        data: {
          shortUrl,
          id: newLink._id
        }
    });
  });

  // In linkController.js
export const getLinkStats = catchAsync(async (req, res, next) => {
    const link = await Link.findOne({
      _id: req.params.id,
      user: req.user._id
    });
  
    if (!link) {
      return next(new AppError('No link found with that ID', 404));
    }
  
    // Group clicks by target value
    const statsByTarget = {};
    link.clicks.forEach(click => {
      const target = click.targetParamValue || '(direct)';
      statsByTarget[target] = (statsByTarget[target] || 0) + 1;
    });
  
    // Get target names for better display
    const targetInfo = {};
    link.targetValues.forEach(tv => {
      targetInfo[tv.value] = tv.name;
    });
  
    res.status(200).json({
      status: 'success',
      data: {
        totalClicks: link.clicks.length,
        targetParamName: link.targetParamName,
        targetInfo,
        clicksByTarget: statsByTarget,
        clicks: link.clicks.map(click => ({
          insertedAt: click.insertedAt,
          ipAddress: click.ipAddress,
          targetValue: click.targetParamValue
        }))
      }
    });
  });

// Update a link
export const updateLink = catchAsync(async (req, res, next) => {
  const { originalUrl } = req.body;
  
  if (!originalUrl) {
    return next(new AppError('Please provide the original URL', 400));
  }

  const updatedLink = await Link.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id // Ensure the link belongs to the current user
    },
    { originalUrl },
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedLink) {
    return next(new AppError('No link found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      link: updatedLink
    }
  });
});

// Delete a link
export const deleteLink = catchAsync(async (req, res, next) => {
  const link = await Link.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id // Ensure the link belongs to the current user
  });

  if (!link) {
    return next(new AppError('No link found with that ID', 404));
  }

  // Remove link from user's links array
  await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { links: link._id } }
  );

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Redirect from short URL
export const getLinkAndRedirect = catchAsync(async (req, res, next) => {
  const { shortId } = req.params;

  if (!shortId) {
    return next(new AppError('Short ID is missing', 400));
  }

  const link = await Link.findById(shortId);

  if (!link) {
    return next(new AppError('No link found with that ID', 404));
  }

  // Get the target parameter value from query string
  // Uses the link's targetParamName (defaults to 't')
  const targetValue = req.query[link.targetParamName];

  // Track the click with target value
  const clickData = {
    ipAddress: req.ip || req.connection.remoteAddress,
    targetParamValue: targetValue || null
  };

  // Add the click to the link's clicks array
  link.clicks.push(clickData);
  await link.save({ validateBeforeSave: false });

  res.redirect(302, link.originalUrl);
});
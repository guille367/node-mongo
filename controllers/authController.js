const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { promisify } = require('util');
const sendMail = require('../utils/email')

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

exports.signup = catchAsync(async(req, res) => {
  const { name, email, password, passwordConfirm, role } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role
  });

  const token = signToken(newUser._id);
  
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});


exports.login = catchAsync(async(req, res, next) => {
  const { email, password } = req.body;
  if(!email || !password) {
    return next(new AppError('Provide an email and a password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  
  if(!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(`User or password incorrect`, 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    data: { user }
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;
  if(authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }
  console.log('authorization', authorization)

  if(!token) {
    return next(new AppError('You are not logged in', 401));
  }
  
  const decodedPayload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
 
  const freshUser = await User.findById(decodedPayload.id);
  
  if(!freshUser) {
    return next(new AppError('The user belonging to the token does not longer exits', 401));
  }

  if(freshUser.passwordHasChanged(decodedPayload.iat)) {
    return next(new AppError(`Recently changed password, Please login again`, 401))
  }

  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => catchAsync(async (req, res, next) => {
  if(!roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to perform this action', 403));
  }

  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if(!user) {
    return next(new AppError('User does not exists', 404));
  }
  
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/reset-password/${resetToken}`;
  
  const message = `Forgot your password? Submit a patch request to this url ${resetUrl} with your new password`;
  await sendMail({ 
    email: user.email,
    subject: 'Your password reset token (valid for 10min)', 
    message
  })
  console.log(user)
  res.status(200).json({
    status: 'succes',
    data: { token: user.passwordResetToken }
  })
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // const user = await User.findOne({ email: req.body.email });
  
  // if(!user) {
  //   return next(new AppError('There is no user with this mail address'));
  // }

  // const resetToken

  // next();
});
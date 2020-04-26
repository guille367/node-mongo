const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { promisify } = require('util');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

exports.signup = catchAsync(async(req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm
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
  console.log(user, password)
  if(!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(`User or password incorrect`, 401));
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;

  if(authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  if(!token) {
    return next(new AppError('You are not logged in', 401));
  }
  
  const decodedPayload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
 
  const freshUser = await User.findById(decodedPayload.id);
  
  if(!freshUser) {
    return next(new AppError('The user belonging to the token does not longer exits', 401));
  }

  if(user.passwordHasChanged(decodedPayload.iat)) {
    return next(new AppError(`Recently changed password, Please login again`, 401))
  }

  req.user = freshUser;
  next();
})
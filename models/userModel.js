const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true, 
    unique: true, 
    trim: true,
    required: [true, 'A name is required']
  },
  email: {
    type: String,
    unique: true, 
    trim: true,
    required: [true, 'An email is required'],
    validate: [validator.isEmail, 'Invalid email']
  },
  image: {
    type: String
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: `Password doesn't match`
    },
    select: false
  },
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  
  next();
});

userSchema.methods.correctPassword = function(candidatePassword, password) {
  return bcrypt.compare(candidatePassword, password);
}

userSchema.methods.passwordHasChanged = function(JWTTimestamp) {
  if(this.passwordChangedAt) {
    const changedPassword = parseInt(this.passwordChangedAt.getTime() / 1000);
    // si el issued token es menor a la última vez que se cambió la contraseña
    // rebotar el loggin (true)
    return JWTTimestamp < changedPassword;
  }
  
  return false;
}

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
}

const User = mongoose.model('User', userSchema);
module.exports = User;
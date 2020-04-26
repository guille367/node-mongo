const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
  passwordChangedAt: Date
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

const User = mongoose.model('User', userSchema);
module.exports = User;
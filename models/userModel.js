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
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: `Password doesn't match`
    }
  },
});

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
const validator = require('validator');
const crypto = require('crypto');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User cannot be without name'],
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  roles: {
    type: String,
    enum: ['guide', 'user', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password not confirmed'],
    validate: {
      //This only works on SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: 'The passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  //only run if passowrd is modified
  if (!this.isModified('password')) return next();

  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete the confirm password
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.verifyPassword = async function (
  enteredPassword,
  actualPassword
) {
  return await bcrypt.compare(enteredPassword, actualPassword);
};

userSchema.methods.changedPasswordAfter = async function (tokenIssuedTime) {
  if (this.passwordChangedAt) {
    const passwordChangeTime = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return tokenIssuedTime < passwordChangeTime;
  }

  // password is not changed
  return false;
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

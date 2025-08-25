const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userType = require('../utils/userType');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  image: {
    type: String,
    default: null,
  },
  imagePublicId: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
activationCode:{
  type:String
},
  role: {
    type: String,
    enum: [
      userType.userType.ADMIN,
      userType.userType.MANAGER,
      userType.userType.CUSTOMER,
    ],
    default: userType.userType.CUSTOMER,
  },
  isActive: {
    type: Boolean,
    default: false, 
  },
  token: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.token;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;

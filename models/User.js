
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/ // Indian mobile number pattern
  },
  ward: {
    type: String,
    required: true
  },
  constituency: {
    type: String,
    required: true
  },
  deviceId: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);

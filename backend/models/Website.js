const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Website name is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Website URL is required'],
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
      default: '',
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    status: {
      type: String,
      enum: ['active', 'deleted', 'old'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Website', websiteSchema);
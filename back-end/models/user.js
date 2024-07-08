const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple documents without googleId
  },
  surname: {
    type: String,
    required: function () {
      return !this.googleId; // Required if not a Google user
    }
  },
  firstname: {
    type: String,
    required: function () {
      return !this.googleId; // Required if not a Google user
    }
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  account: {
    type: String,
    unique: true,
    required: function () {
      return !this.googleId; // Required if not a Google user
    }
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // Required if not a Google user
    }
  }
});

// Pre-save hook to capitalize the first letter of the surname and firstname
userSchema.pre('save', function (next) {
  if (this.surname) {
    this.surname = this.surname.charAt(0).toUpperCase() + this.surname.slice(1);
  }
  if (this.firstname) {
    this.firstname = this.firstname.charAt(0).toUpperCase() + this.firstname.slice(1);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);


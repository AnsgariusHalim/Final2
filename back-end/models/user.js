const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  surname: { type: String, required: true },
  firstname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  account: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Pre-save hook to capitalize the first letter of the surname and firstname
userSchema.pre('save', function (next) {
  this.surname = this.surname.charAt(0).toUpperCase() + this.surname.slice(1);
  this.firstname = this.firstname.charAt(0).toUpperCase() + this.firstname.slice(1);
  next();
});

// Create and export the user model
module.exports = mongoose.model('User', userSchema);

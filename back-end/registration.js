const mongoose = require('mongoose');
const User = require('./models/user');

// Define the user schema
const userSchema = new mongoose.Schema({
  surname: { type: String, required: true },
  firstname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  account: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.pre('save', function (next) {
  this.surname = this.surname.charAt(0).toUpperCase() + this.surname.slice(1);
  this.firstname = this.firstname.charAt(0).toUpperCase() + this.firstname.slice(1);
  next();
});

// Define the registerUser function
const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    console.log('Received user data:', userData);

    // Check for existing email and account (username)
    const existingUser = await User.findOne({ $or: [{ email: userData.email }, { account: userData.account }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or account already exists' });
    }

    // Create a new user instance and save it to the database
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    console.log('User saved to database:', savedUser);

    res.status(200).json({ message: 'User registered successfully', data: savedUser });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = registerUser;
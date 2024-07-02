const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/accounts', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Check MongoDB connection
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Check for MongoDB connection errors
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Create a schema for user account
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  email: String,
  password: String // Can be empty for Google Sign-In users
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

// Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: '67194094732-eumnn8tnqsvam81qp4k9uuafni5id06b.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { given_name, family_name, email } = profile._json;

    // Check if user with given email already exists in the database
    let user = await User.findOne({ email });
    if (!user) {
      // Create a new user
      user = new User({
        firstName: given_name,
        lastName: family_name,
        email: email,
        username: email, // You can set the username to the email or use a different approach
      });
      await user.save();
    }

    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

module.exports = User;

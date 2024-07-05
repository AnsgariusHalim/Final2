const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error('Error during deserialization:', error);
    done(error, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3001/auth/google/callback'
}, async (token, tokenSecret, profile, done) => {
  try {
    console.log('Google profile:', profile);
    const email = profile.emails[0].value;

    // Check if the email already exists
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      // If user exists, only update the Google ID
      existingUser.googleId = profile.id;
      await existingUser.save();
      return done(null, existingUser);
    }

    // If user does not exist, create a new user
    const newUser = new User({
      googleId: profile.id,
      firstname: profile.name.givenName,
      surname: profile.name.familyName,
      email: email,
      account: email, // Using email as account for simplicity
      password: null // No password for Google-authenticated users
    });

    const savedUser = await newUser.save();
    done(null, savedUser);
  } catch (error) {
    console.error('Error during user save:', error);
    done(error, null);
  }
}));

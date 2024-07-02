const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const User = require('./back-end/signup'); // Import the User model

// Setup Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Generate and use secret key for session encryption
const secretKey = 'abfa8a0f0ec1f173e5733310252713276f2aea5afeec6a77c91ba979102cf9d7'; // Replace 'your_secret_key' with the generated key
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
}));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the 'front-end' folder
app.use(express.static(path.join(__dirname, 'front-end')));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user); // Assuming user contains all necessary information
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user); // Assuming user contains all necessary information
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end', 'homepage.html'));
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, send a success message and redirect to homepage
    res.send('<script>alert("Signup successful! Redirecting to the homepage..."); window.location.href = "/";</script>');
  }
);

app.post('/signup', async (req, res) => {
  const { firstName, lastName, username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  // Create a new user instance
  const newUser = new User({
    firstName,
    lastName,
    username,
    email,
    password
  });

  // Save the user to the database
  try {
    await newUser.save();
    res.status(200).send('User signed up successfully');
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).send('Error saving user');
  }
});

app.post('/google-signup', async (req, res) => {
  const { idtoken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: idtoken,
      audience: '67194094732-eumnn8tnqsvam81qp4k9uuafni5id06b.apps.googleusercontent.com', // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const { given_name, family_name, email } = payload;

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

    res.status(200).send('Google sign-up successful');
  } catch (error) {
    console.error('Error signing up with Google:', error);
    res.status(500).send('Error signing up with Google');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});

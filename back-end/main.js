const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();
require('./passport-setup');
const registerUser = require('./registration');
const User = require('./models/user');

const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Account', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(error => {
  console.error('Error connecting to MongoDB:', error);
});

// Endpoint to handle registration
app.post('/register', registerUser);

// Endpoint to check if email or username already exists
app.post('/check-existence', async (req, res) => {
  const { field, value } = req.body;
  if (!['email', 'account'].includes(field)) {
    return res.status(400).json({ message: 'Invalid field' });
  }

  try {
    const user = await User.findOne({ [field]: value });
    res.status(200).json({ exists: !!user });
  } catch (error) {
    console.error('Error checking existence:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Google OAuth routes
app.get('/auth/google', (req, res, next) => {
  console.log('Auth Google route hit');
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/login'
}), (req, res) => {
  res.redirect('http://localhost:3000/index.html');
});

// Serve static files from front-end directory
app.use(express.static('front-end'));

// Default route handler for any other routes
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Error handler middleware (optional)
app.use((err, req, res, next) => {
  console.error('Error during processing:', err);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Back-end server is running on http://localhost:${port}`);
});

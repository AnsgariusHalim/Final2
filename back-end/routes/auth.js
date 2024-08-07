const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
const { Readable } = require('stream');
const { GridFSBucket } = require('mongodb');

const router = express.Router();

// MongoDB URI
const mongoURI = 'mongodb://localhost:27017/Account';

// Create a connection to the MongoDB database
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Initialize GridFS
let gfs, gridfsBucket;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
});

// Use multer's memory storage to temporarily store the files before uploading them to GridFS
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Check if email or username exists
router.post('/check-existence', async (req, res) => {
  try {
    const { field, value } = req.body;
    let user;

    if (field === 'email') {
      user = await User.findOne({ email: value });
    } else if (field === 'account') {
      user = await User.findOne({ account: value });
    }

    res.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking existence:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register a new user with profile picture upload
router.post('/register', upload.single('profilePicture'), async (req, res) => {
  try {
    const { email, account, password } = req.body;

    // Check if the email or account already exists
    const existingUser = await User.findOne({ $or: [{ email }, { account }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or account already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Initialize user data
    const newUser = new User({
      email,
      account,
      password: hashedPassword,
    });

    // Upload profile picture if provided
    if (req.file) {
      const filename = `${crypto.randomBytes(16).toString('hex')}${path.extname(req.file.originalname)}`;
      const readableStream = Readable.from(req.file.buffer);

      const uploadStream = gridfsBucket.openUploadStream(filename, {
        contentType: req.file.mimetype,
      });

      readableStream.pipe(uploadStream)
        .on('error', (err) => {
          console.error('Error uploading file:', err);
          return res.status(500).json({ message: 'Failed to upload profile picture' });
        })
        .on('finish', async () => {
          newUser.profilePicture = uploadStream.id; // Store the file ID
          await newUser.save();
          res.status(201).json({ message: 'User registered successfully.' });
        });
    } else {
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully.' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { account, password } = req.body;

  try {
    // Find user by email or account
    const user = await User.findOne({ $or: [{ email: account }, { account }] });

    if (!user) {
      return res.status(400).json({ message: 'Account does not exist. Please register.' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password. Please try again.' });
    }

    // Login successful
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Login failed. Please try again.' });
      }
      return res.status(200).json({ message: 'Login successful.' });
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      isLoggedIn: true,
      username: req.user.account,
      profilePicture: req.user.profilePicture, // Include profile picture URL
    });
  } else {
    res.json({ isLoggedIn: false });
  }
});


// Get image by filename
router.get('/image/:filename', (req, res) => {
  gridfsBucket.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'No file exists' });
    }

    const file = files[0];
    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      const downloadStream = gridfsBucket.openDownloadStreamByName(file.filename);
      downloadStream.pipe(res);
    } else {
      res.status(404).json({ message: 'Not an image' });
    }
  });
});

// Delete image by ID
router.delete('/image/:id', (req, res) => {
  gridfsBucket.delete(new mongoose.Types.ObjectId(req.params.id), (err) => {
    if (err) {
      console.error('Error deleting image:', err);
      return res.status(500).json({ message: 'Could not delete image' });
    }
    res.status(200).json({ message: 'Image deleted successfully' });
  });
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
    res.redirect('http://localhost:3000');
  });

module.exports = router;

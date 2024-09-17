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


router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).json({ message: 'An error occurred during authentication' });
    }
    if (!user) {
      console.warn('Authentication failed:', info);
      return res.status(401).json({ message: 'Incorrect account or password' });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'An error occurred during login' });
      }
      return res.json({
        message: 'Login successful',
        redirectUrl: 'http://localhost:3000/', // Redirect to the homepage
      });
    });
  })(req, res, next);
});


// Google Auth callback route
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: 'http://localhost:3000/login.html',
  successRedirect: 'http://localhost:3000/',
}));

// Google Auth callback route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Status route to check if user is authenticated
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    console.log('User is authenticated:', req.user); // Add this line
    res.json({
      isLoggedIn: true,
      user: {
        userId: req.user._id,  // Assuming `req.user._id` is the unique ID for the user
        account: req.user.account,
        profilePicture: req.user.profilePicture
      }
    });
  } else {
    res.json({ isLoggedIn: false });
  }
});

// Serve user image by file ID
router.get('/image/:id', async (req, res) => {
  try {
    const fileId = mongoose.Types.ObjectId.createFromHexString(req.params.id); // Ensure ID is converted to ObjectId
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });

    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });

    downloadStream.on('error', (err) => {
      console.error('Error downloading image:', err);
      res.status(404).json({ message: 'Image not found' });
    });

    downloadStream.on('end', () => {
      res.end();
    });
  } catch (err) {
    console.error('Error retrieving image:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/image/:filename', (req, res) => {
  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).send('File not found');
    }

    // Check if image
    if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png') {
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    } else {
      res.status(404).send('Not an image');
    }
  });
});
// Logout route
// Logout route
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logout successful', redirectUrl: 'http://localhost:3000' });
  });
});


// Delete image by ID
router.delete('/image/:id', (req, res) => {
  gridfsBucket.delete(mongoose.Types.ObjectId.createFromHexString(req.params.id), (err) => {
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


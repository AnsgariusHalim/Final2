const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const registerUser = require('./registration');
const User = require('./models/user'); // Ensure the path is correct

const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

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

// Default route handler for any other routes
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Error handler middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Back-end server is running on http://localhost:${port}`);
});

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to serve static files from the 'front-end' folder
app.use(express.static(path.join(__dirname, 'front-end')));

// Route for the index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end', 'index.html'));
});

// Route for the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end', 'login.html'));
});

// Route for the registration page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end', 'registration.html'));
});

// Add more routes for other pages as needed
app.get('/userbrowser', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end', 'userbrowser.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

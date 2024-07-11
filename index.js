const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the front-end folder
app.use(express.static(path.join(__dirname, 'front-end')));

// Serve the main index.html file for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end' ,'index.html'));
});


// Serve the registration.html file
app.get('/registration.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end', 'registration.html'));
});

// Serve the login.html file
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end', 'login.html'));
});

app.listen(port, () => {
  console.log(`Front-end server is running on http://localhost:${port}`);
});


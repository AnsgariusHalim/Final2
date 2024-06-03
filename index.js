const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the front-end folder
app.use(express.static(path.join(__dirname, 'front-end')));

// Serve the main index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end', 'index.html'));
});

// Endpoint to serve the homepage.html file
app.get('/homepage.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end', 'homepage.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

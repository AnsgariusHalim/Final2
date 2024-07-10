const User = require('./models/user');

const loginUser = async (req, res) => {
  const { account, password } = req.body;

  try {
    const user = await User.findOne({ account });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Successful login
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = loginUser;

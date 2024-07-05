const User = require('./models/user');

const registerUser = async (req, res) => {
  try {
    const { surname, firstname, email, account, password } = req.body;

    // Check if email or account already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const accountExists = await User.findOne({ account });
    if (accountExists) {
      return res.status(400).json({ message: 'Account already exists' });
    }

    // Create new user
    const newUser = new User({
      surname,
      firstname,
      email,
      account,
      password,
      googleId: undefined // Ensure googleId is not set
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = registerUser;

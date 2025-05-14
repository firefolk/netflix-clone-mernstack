import { User } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';

// Controller for user signup
export async function signup(req, res) {
  try {
    const { email, password, username } = req.body;

    // Check if all required fields are provided
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
    }

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    // Ensure password is at least 6 characters
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if email already exists in the database
    const existingUserByEmail = await User.findOne({ email: email });
    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already exists' });
    }

    // Check if username already exists in the database
    const existingUserByUsername = await User.findOne({ username: username });
    if (existingUserByUsername) {
      return res
        .status(400)
        .json({ success: false, message: 'Username already exists' });
    }

    // Hash the password before saving
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Randomly assign a profile picture from predefined options
    const PROFILE_PICS = ['/avatar1.png', '/avatar2.png', '/avatar3.png'];
    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    // Create a new user instance
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      image,
    });

    // Generate JWT token and set it as a cookie
    generateTokenAndSetCookie(newUser._id, res);

    // Save the new user to the database
    await newUser.save();

    // Respond with the created user (excluding password)
    res.status(201).json({
      success: true,
      user: {
        ...newUser._doc,
        password: '',
      },
    });
  } catch (error) {
    console.log('Error in signup controller', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Controller for user login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
    }

    // Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // Compare provided password with stored hashed password
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token and set it as a cookie
    generateTokenAndSetCookie(user._id, res);

    // Respond with user data (excluding password)
    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: '',
      },
    });
  } catch (error) {
    console.log('Error in login controller', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Controller for user logout
export async function logout(req, res) {
  try {
    // Clear the authentication cookie
    res.clearCookie('jwt-netflix');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.log('Error in logout controller', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Controller to check authentication status
export async function authCheck(req, res) {
  try {
    // Respond with the authenticated user's data
    console.log('req.user:', req.user);
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.log('Error in authCheck controller', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

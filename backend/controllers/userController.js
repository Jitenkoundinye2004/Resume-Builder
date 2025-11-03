import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/resume.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Corrected function name + added closing bracket
const generateToken = (userID) => {
  // place the id under `userId` so auth middleware's `decoded.userId` works
  const token = jwt.sign({ userId: userID }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return token;
};

// controller for user registration
// POST: /api/users/register
export const registerUser = async (req, res) => {
  try {
    console.log('Registration attempt:', { name: req.body.name, email: req.body.email });

    const { name, email, password } = req.body;

    // check if required fields are present
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(409).json({ message: 'User already exists' });
    }

    // create new user
    const hashedPassword = await bcrypt.hash(password, 12); // Increased rounds for better security
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    await newUser.save();
    console.log('User created successfully:', newUser._id);

    // return success response
    const token = generateToken(newUser._id);
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email
    };

    console.log('Registration successful for:', email);
    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// controller for user login
// POST: /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // return success response
    const token = generateToken(user._id);
    user.password = undefined;
    res.status(200).json({ message: 'User logged in successfully', user, token });

  } catch (error) {
    return res.status(400).json({ message: 'Server error', error: error.message });
  }
};

// controller for getting user by id
// GET: /api/users/data
export const getUserById = async (req, res) => {
  try {
    const userId = req.userId;

    // check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // return user
    user.password = undefined;
    return res.status(200).json({ user });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


//controller for getting user resume data

// GET: /api/users/resume
export const getUserResume = async (req, res) => {
  try {
    const userId = req.userId;

    // return user resume
    const resume = await Resume.find({ $or: [{ userId }, { userID: userId }] });
    return res.status(200).json({ resume });
    } catch (error) {
    return res.status(400).json({ message: error.message });
    }
}

// controller for forgot password
// POST: /api/users/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // set token and expiry (1 hour)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You requested a password reset for your Resume Builder account.</p>
          <p>Please click the link below to reset your password:</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/reset-password/${resetToken}"
             style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>Resume Builder Team</p>
        </div>
      `
    };

    // send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent successfully' });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// controller for reset password
// POST: /api/users/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // hash the token
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // find user with valid token
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update user
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

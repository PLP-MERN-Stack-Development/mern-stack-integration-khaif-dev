const User = require('../models/user');
const express = require('express');
const router = express.Router();
const asyncWrapper = require('../middleware/asyncWrapper');
const NotFoundError = require('../middleware/error-handler');
const {userValidationRules, validateUser } = require('../middleware/validator');
const { route } = require('./postRoutes');

// create user
router.post('/register', userValidationRules, validateUser, asyncWrapper(async (req, res) => {
  const newUser = new User(req.body);
  const savedUser = await newUser.save();

  res.status(201).json({
    message: 'User registered successfully',
    user: savedUser
  });
}));

// login user
router.post('/login', asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const jwt = require('jsonwebtoken');
  const token = jwt.sign(
    { id: user._id, username: user.username, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
}));

// get user 
router.get('/', asyncWrapper( async(req,res) => {
    const users = await User.find();
    if(!users) throw new NotFoundError('No users found');
    res.status(200).json(users);
}));

router.get('/:id', asyncWrapper(async (req,res) => {
    const user = await User.findById(req.params.id);
    if(!user) throw new NotFoundError('User Not Found');
    res.status(200).json(user)
}));

router.delete('/:id', asyncWrapper( async(req,res) => {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    if(!deleteUser) throw new NotFoundError('User Not Found');
    res.status(200).json(`${deleteUser.name} deleted`);
}));

module.exports = router;
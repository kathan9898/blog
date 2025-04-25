const bcrypt = require('bcrypt');
const passport = require('passport');
const Joi = require('joi');
const User = require('../models/User');

const registerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required()
});

exports.getRegister = (req, res) => {
  res.render('auth/register');
};

exports.postRegister = async (req, res) => {
  try {
    const { username, password } = req.body;

    const { error } = registerSchema.validate({ username, password });
    if (error) {
      req.flash('error_msg', error.details[0].message);
      return res.redirect('/register');
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash('error_msg', 'Username already exists');
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    req.flash('success_msg', 'You are now registered! Please log in.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Registration failed. Please try again.');
    res.redirect('/register');
  }
};

exports.getLogin = (req, res) => {
  res.render('auth/login');
};

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
};

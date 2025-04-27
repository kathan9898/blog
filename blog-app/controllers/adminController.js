const User = require('../models/User');
const Post = require('../models/Post');

exports.adminDashboard = async (req, res) => {
  const users = await User.find();
  const posts = await Post.find().populate('createdBy', 'username');
  res.render('admin/dashboard', { users, posts });
};

exports.deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Post deleted by Admin');
  res.redirect('/admin');
};

exports.makeAdmin = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isAdmin: true });
  req.flash('success_msg', 'User promoted to Admin');
  res.redirect('/admin');
};

exports.removeAdmin = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isAdmin: false });
  req.flash('success_msg', 'User demoted from Admin');
  res.redirect('/admin');
};

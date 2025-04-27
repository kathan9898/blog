module.exports = function(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  req.flash('error_msg', 'Not authorized as Admin');
  res.redirect('/');
};

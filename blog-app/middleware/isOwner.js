const Post = require('../models/Post');

module.exports = async function (req, res, next) {
  const post = await Post.findById(req.params.id);
  if (!post || !post.createdBy.equals(req.user._id)) {
    req.flash('error_msg', 'You are not authorized');
    return res.redirect('/posts');
  }
  next();
};

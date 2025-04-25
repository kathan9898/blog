const Post = require('../models/Post');
const Joi = require('joi');

const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  tags: Joi.string().allow('')
});

exports.index = async (req, res) => {
  const posts = await Post.find().populate('createdBy', 'username').sort({ createdAt: -1 });
  res.render('posts/index', { posts });
};

exports.getNew = (req, res) => {
  res.render('posts/new');
};

exports.create = async (req, res) => {
  const { title, content, tags } = req.body;
  const { error } = postSchema.validate({ title, content, tags });

  if (error) {
    req.flash('error_msg', error.details[0].message);
    return res.redirect('/posts/new');
  }

  const post = new Post({
    title,
    content,
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    createdBy: req.user._id
  });

  await post.save();
  req.flash('success_msg', 'Post created successfully!');
  res.redirect('/posts');
};

exports.getEdit = async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('posts/edit', { post });
};

exports.update = async (req, res) => {
  const { title, content, tags } = req.body;
  const post = await Post.findById(req.params.id);

  post.title = title;
  post.content = content;
  post.tags = tags ? tags.split(',').map(tag => tag.trim()) : [];

  await post.save();
  req.flash('success_msg', 'Post updated!');
  res.redirect('/posts');
};

exports.delete = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Post deleted!');
  res.redirect('/posts');
};

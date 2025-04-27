const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const isOwner = require('../middleware/isOwner');

// Auth middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('error_msg', 'Please login first');
  res.redirect('/login');
}

// Routes
router.get('/', postController.index);
router.get('/search', postController.searchPosts); // <-- NEW
router.get('/new', isLoggedIn, postController.getNew);
router.post('/', isLoggedIn, postController.create);
router.get('/:id/edit', isLoggedIn, isOwner, postController.getEdit);
router.put('/:id', isLoggedIn, isOwner, postController.update);
router.delete('/:id', isLoggedIn, isOwner, postController.delete);

module.exports = router;

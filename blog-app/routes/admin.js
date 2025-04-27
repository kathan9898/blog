const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const isAdmin = require('../middleware/isAdmin');

router.get('/', isAdmin, adminController.adminDashboard);
router.delete('/post/:id', isAdmin, adminController.deletePost);

// New routes to make or remove admin
router.put('/user/:id/make-admin', isAdmin, adminController.makeAdmin);
router.put('/user/:id/remove-admin', isAdmin, adminController.removeAdmin);

module.exports = router;

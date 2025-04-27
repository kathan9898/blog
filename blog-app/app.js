const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/blogApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Session
app.use(session({
  secret: 'superSecretKey',
  resave: false,
  saveUninitialized: false
}));

// Passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Global flash variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Routes
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

app.use('/', userRoutes);
app.use('/posts', postRoutes);

// Default route
app.get('/', (req, res) => {
  // if (!req.isAuthenticated()) return res.redirect('/login');
  res.redirect('/posts');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

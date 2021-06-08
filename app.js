const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('express-flash');
const connectDB = require('./config/database');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const methodOverride = require('method-override');

const cloudinary = require('cloudinary').v2;
const homeRoutes = require('./routes/home');
const postRoutes = require('./routes/posts');

// Settings and whatnot
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());
app.use(methodOverride('_method'));

// Connect DB
connectDB();

// Session must come BEFORE passport setup stuff
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.DB_STRING })
}));

// Set up passport
require('./config/passport')(passport)
app.use(passport.initialize());
app.use(passport.session());

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

// Routes come last before starting server
app.use('/', homeRoutes);
app.use('/posts', postRoutes);


// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Your server is running on port ${process.env.PORT}, you better go catch it!`);
})
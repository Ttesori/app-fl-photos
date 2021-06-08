const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')

module.exports = {
  getHome: (req, res) => {
    res.render('home/index.ejs', {
      title: 'Home',
      className: 'page-home',
      user: false
    });
  },
  loginUser: (req, res, next) => {
    const validationErrors = []
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
    if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' })

    if (validationErrors.length) {
      req.flash('errors', validationErrors)
      return res.redirect('/')
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })

    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err) }
      if (!user) {
        req.flash('errors', info)
        return res.redirect('/')
      }
      req.logIn(user, (err) => {
        if (err) { return next(err) }
        req.flash('success', { msg: 'Success! You are logged in.' })
        res.redirect(req.session.returnTo || '/posts')
      })
    })(req, res, next)
  },
  getRegisterUser: (req, res) => {
    res.render('home/register.ejs', {
      title: 'Register',
      className: 'page-register',
      user: false
    });
  },
  registerUser: (req, res, next) => {
    const validationErrors = []
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
    if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
    if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })

    if (validationErrors.length) {
      req.flash('errors', validationErrors)
      return res.redirect('/register')
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })

    const user = new User({
      email: req.body.email,
      password: req.body.password
    })

    User.findOne({
      $or: [
        { email: req.body.email }
      ]
    }, (err, existingUser) => {
      if (err) { return next(err) }
      if (existingUser) {
        req.flash('errors', { msg: 'Account with that email address already exists.' })
        return res.redirect('/register')
      }
      user.save((err) => {
        if (err) { return next(err) }
        req.logIn(user, (err) => {
          if (err) {
            return next(err)
          }
          res.redirect('/posts')
        })
      })
    })
  },
  logoutUser: (req, res) => {
    req.logout();
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err)
      req.user = null
      res.redirect('/')
    })
  }
}
const express = require('express');
const router  = express.Router();
const passport = require('passport');
const User     = require('../models/User');

// kayıt formu
router.get('/register', (req, res) => {
  res.render('auth/register');
});
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  req.flash('success','Kayıt başarılı, giriş yapabilirsiniz');
  res.redirect('/login');
});

// giriş formu
router.get('/login', (req, res) => {
  res.render('auth/login');
});
router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    req.flash('success','Hoş geldin '+ req.user.username);
    res.redirect('/');
  }
);

// çıkış
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success','Çıkış yapıldı');
  res.redirect('/');
});

module.exports = router;


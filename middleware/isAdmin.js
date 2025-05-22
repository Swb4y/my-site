module.exports = function(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  req.flash('error','Bu alana ulaşmak için admin olmalısınız');
  res.redirect('/');
};


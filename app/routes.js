function setUpRoutes(app, passport, db) {

  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  app.get('/chat', function (req, res) {
    res.render('chat.ejs');
  });

  app.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile.ejs');
  });

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/login', function (req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login', 
    failureFlash: true
  }));

  app.get('/signup', function (req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });


  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', 
    failureRedirect: '/signup', 
    failureFlash: true
  }));

  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}

module.exports = {
  setUpRoutes,
  isLoggedIn
}
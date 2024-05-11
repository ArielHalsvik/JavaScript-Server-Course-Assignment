var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local');

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  const userData = user ? user.username : '';
  return cb(null, userData);
});

passport.use(new LocalStrategy(function verify(username, password, cb) {
  let usersArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/users.json')));
  let filteredArray = usersArray.filter(x => x.username == username);
  if (filteredArray.length > 0) {
    let usersData = filteredArray[0];
    if (usersData.password == password) {
      return cb(null, usersData);
    } else {
      return cb(null, false);
    }
  } else {
    return cb(null, false);
  }
}));

router.post('/', passport.authenticate('local', {
  successRedirect: '/memes',
  failureRedirect: '/login'
}), (req, res) => {
  req.session.currentUser = req.user;
  res.redirect('/');
});

router.get('/', (req, res ) => {
    if(!req.user) {
      res.render('login', { currentUser: null });
    }
    else {
      res.render('login', { currentUser: req.user });
    }
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) { return next(err); }
      fs.writeFileSync('./data/coloredMemes.json', '[]');
      res.redirect('/login');
    });
});

module.exports = router;
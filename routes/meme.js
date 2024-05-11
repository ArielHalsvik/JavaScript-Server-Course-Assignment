var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require("path");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();

const memesArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/memes.json')));

router.get('/:id', ensureLoggedIn, jsonParser, (req, res, next) => {
  const memeId = parseInt(req.params.id);
  const memeDetails = memesArray.memes.find(meme => meme.id === memeId);
  
  res.render('meme', { currentUser: req.user, meme: memeDetails });
});

router.post('/', ensureLoggedIn, (req, res, next) => {
  const memeId = req.body.memeId;
  const memeDetails = memesArray.memes.find(meme => meme.id === memeId);

  if (memeDetails) {
    res.render('meme', { meme: memeDetails, currentUser: req.user });
  } else {
    res.status(404).send('Meme not found', { currentUser: req.user } );
  }
});

module.exports = router;
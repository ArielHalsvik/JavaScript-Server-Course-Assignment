var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  const currentUser = req.user;
  res.render('index', { currentUser });
});

module.exports = router;
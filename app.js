const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
	secret: 'secret_sentence_here',
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const memesRouter = require('./routes/memes');
const memeRouter = require('./routes/meme');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.use((req, res, next) => {
	if (!req.session.coloredRows) {
	  req.session.coloredRows = [];
	}
	next();
  });

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/memes', memesRouter);
app.use('/meme', memeRouter);

app.use(function (req, res, next) {
	next(createError(404));
});

app.use(function (err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
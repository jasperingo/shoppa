
require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var i18n = require('i18n');
var cors = require('cors');

var MyResponse = require('./http/Response');
var apiRouter = require('./routes/EndPoints');
const { StatusCodes } = require('http-status-codes');
const NotFoundException = require('./http/exceptions/NotFoundException');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

i18n.configure({
  locales: ['en'],
  directory: path.join(__dirname, '/locales'),
  defaultLocale: 'en',
  updateFiles: false,
  objectNotation: true,
  autoReload: true,
});


app.use(cors({
  preflightContinue: true
}));

app.use(i18n.init);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.options('*', cors());

app.use('/api', apiRouter);


app.use(function(req, res, next) {
  next(new NotFoundException({ path: req.originalUrl }));
});

app.use(function(err, req, res, next) {

  console.log(err);

  const response = new MyResponse();
  response.status = MyResponse.ERROR;
  response.message = res.__(err.message || '');
  response.data = err.data ?? undefined;
  
  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR);
  res.json(response);
});

module.exports = app;

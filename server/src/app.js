const express = require('express');
//HTTP request logger middleware for node.js
const morgan = require('morgan');
//helps secure Express apps with HTTP headers.
const helmet = require('helmet');
//Middleware used to enable CORs
//Fixes COR issue on firefox and chrome
const cors = require('cors');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

//Implementation of the Middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(cors());

//Root GET function. Displays server.
app.get('/', (req, res) => {
  res.json({
    message: 'Failte'
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;

const express = require('express');
//HTTP request logger middleware for node.js
const morgan = require('morgan');
//helps secure Express apps with HTTP headers.
const helmet = require('helmet');
//Middleware used to enable CORs
//Fixes COR issue on firefox and chrome
const cors = require('cors');

const router = express.Router();
require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

/* const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://TradMap:Mojo2012@tradmap-oavvg.mongodb.net/TradMap?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("TradMap").collection("Sessions");
 console.log('connected')
  client.close();
}); */

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

//POST for when no errors are produced.
app.post('/', (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  try{
   {
     console.log('posting');
//Removes the need to write eg) req.body.name below.
    const { event, venue, address, latitude, longitude, dtstart, dtend,} = req.body;
    const Session = {
      event,
      venue,
      address,
      dtstart,
      dtend,
      latitude,
      longitude,
      date: new Date()
     };
   Sessions.insert(Session).then(insertedMessage => {
         res.json(insertedMessage);
   });
 }
}
catch(error) {

  next(result.error);
  console.log('session not posted',result.error);

   }
});


/* const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://TradMap:Mojo2012@tradmap-oavvg.mongodb.net/TradMap?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("TradMap").collection("Sessions");
 // perform actions on the collection object
  client.close();
}); */

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;

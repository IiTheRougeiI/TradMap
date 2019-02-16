const express = require('express');
const Joi = require("joi");

const db = require('../db');
const Sessions = db.get('Sessions');

//Defining the schema for the backend.
const schema = Joi.object().keys({
    name: Joi.string().min(1).max(100).required(),
    address: Joi.string().min(1).max(500).required(),
    latitude:    Joi.number().required(),
    longitude:   Joi.number().required()
});

const router = express.Router();

//Gets all sessions that are found within the DB.
router.get('/', (req, res) => {
  Sessions
  .find()
  .then(allSessions =>{
      res.json(allSessions);
    });
});
//POST for when no errors are produced.
router.post('/', (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error == null) {
//Removes the need to write eg) req.body.name below.
    const { name, address, latitude, longitude,} = req.body;
    const Session = {
      name,
      address,
      latitude,
      longitude,
      date: new Date()
     };
   Sessions.insert(Session).then(insertedMessage => {
         res.json(insertedMessage);
   });
 }
else {
  next(result.error);
   }
});

module.exports = router;

const express = require('express');
const Joi = require("joi");

const db = require('../db');
const Trips = db.get('Trips');

//Defining the schema for the backend.
const adventures = Joi.object().keys({
    name:   Joi.string().min(1).max(100).required(),
    member: {
    name:        Joi.string().min(1).max(500).required(),
  },
    dtstart:     Joi.string().required(),
    dtend:       Joi.string().required(),
    latitude:    Joi.number().required(),
    longitude:   Joi.number().required()
});

const router = express.Router();

//Gets all sessions that are found within the DB.
router.get('/', (req, res) => {
  Trips
  .find()
  .then(allTrips =>{
      res.json(allTrips);
    });
});
//POST for when no errors are produced.
/* router.post('/', (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error == null) {
//Removes the need to write eg) req.body.name below.
    const {name,bio, latitude, longitude,} = req.body;
    const members = {
      name,
      bio,
      latitude,
      longitude,
      date: new Date()
     };
   members.insert(members).then(insertedMessage => {
         res.json(insertedMessage);
   });
 }
else {
  next(result.error);
   }
}); */

module.exports = router;

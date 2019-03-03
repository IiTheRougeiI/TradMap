const express = require('express');
const Joi = require("joi");

const db = require('../db');
const Sessions = db.get('Sessions');

//Defining the schema for the backend.
const schema = Joi.object().keys({
    event:   Joi.string().min(1).max(100).required(),
    venue:   Joi.string().min(1).max(500).required(),
    address: Joi.string().min(1).max(100).required(),
    dtstart: Joi.string().required(),
    dtend:   Joi.string().required(),
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


module.exports = router;

const express = require('express');

const Sessions = require('./Sessions');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/Sessions', Sessions);

module.exports = router;

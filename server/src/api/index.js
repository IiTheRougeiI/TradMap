const express = require('express');
const Members = require('./Members');
const Sessions = require('./Sessions');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/Sessions', Sessions);
router.use('/Members', Members);

module.exports = router;

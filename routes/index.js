const express = require('express');
const router = express.Router();
const Parser = require("../controllers/Parser");

router.get('/', () => {
  return new Parser().parseFile();
});

module.exports = router;

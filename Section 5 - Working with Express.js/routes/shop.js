const express = require("express");

const router = express.Router();

// get uses an exact match
router.get(`/`, (req, res, next) => {
  console.log("Shop Route is hit");
  res.send("<h1>Hello from Express!</h1>");
});

module.exports = router;

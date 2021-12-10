const express = require("express");

const path = require("path");

const rootDir = require("../utils/path");

const router = express.Router();

// get uses an exact match
router.get(`/`, (req, res, next) => {
  // console.log("Shop Route is hit");
  // res.send("<h1>Hello from Express!</h1>");

  // __dirname holds the absolute path to this project folder
  // __dirname also starts/points to where it is being used, in this case the routes folder
  // we do ../ to go up one level to the views
  // we do path.join() because we want this to work on different OS systems
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;

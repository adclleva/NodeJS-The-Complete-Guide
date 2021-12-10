const path = require("path");

const express = require("express");

const rootDir = require("../util/path");
const adminData = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  // console.log('shop.js', adminData.products);
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));

  // this will use the default template engine declared in the app.js file
  // we don't have to construct a path to the folder since we defined that all views are in the views folder
  res.render("shop");
});

module.exports = router;

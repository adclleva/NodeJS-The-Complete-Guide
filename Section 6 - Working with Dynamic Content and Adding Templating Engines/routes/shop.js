const path = require("path");

const express = require("express");

const rootDir = require("../util/path");
const adminData = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  // console.log('shop.js', adminData.products);
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));

  const products = adminData.products;

  // this will use the default template engine declared in the app.js file
  // we don't have to construct a path to the folder since we defined that all views are in the views folder
  // the second argument can be the data that we would like to pass to the template
  res.render("shop", { products: products, pageTitle: "My Shop", path: "/" });
});

module.exports = router;

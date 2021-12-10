const express = require("express");

const path = require("path");

const rootDir = require("../utils/path");

const router = express.Router();

// this will only trigger for only post requests
// /admin/add-product => GET
router.get("/add-product", (req, res, next) => {
  // res.send(
  //   `<form action="/admin/product" method="POST"><input type="text" name="title"> <button type="submit">Add Product</button> </form>`
  // );

  res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

// this will only trigger for only post requests
// /admin/add-product => POST
router.post("/add-product", (req, res, next) => {
  console.log("request:", req.body);
  res.redirect("/");
});

module.exports = router;

const express = require("express");

const router = express.Router();

// this will only trigger for only post requests
router.get("/add-product", (req, res, next) => {
  res.send(
    `<form action="/product" method="POST"><input type="text" name="title"> <button type="submit">Add Product</button> </form>`
  );
});

// this will only trigger for only post requests
router.post("/product", (req, res, next) => {
  console.log("request:", req.body);
  res.redirect("/");
});

module.exports = router;

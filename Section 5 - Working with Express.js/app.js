// this file just spins up the server

// express.js is all about middleware, that executes from top to bottom
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// app.use() middleware function
// next is a function
app.use("/", (req, res, next) => {
  console.log("This always runs!");
  next();
});

app.use("/add-product", (req, res, next) => {
  res.send(
    `<form action="/product" method="POST"><input type="text" name="title"> <button type="submit">Add Product</button> </form>`
  );
});

app.use("/product", (req, res, next) => {
  console.log("request:", req.body);
  res.redirect("/");
});

app.use(`/`, (req, res, next) => {
  res.send("<h1>Hello from Express!</h1>");
});

app.listen(3000);

/**
 * app.listen() does the same thing below 
 const server = http.createServer(app);
 server.listen(3000);
 */

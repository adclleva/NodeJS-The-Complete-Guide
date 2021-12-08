// this file just spins up the server

// express.js is all about middleware, that executes from top to bottom
const express = require("express");

const app = express();

// middleware function
// next is a function
app.use("/", (req, res, next) => {
  console.log("This always runs!");
  next();
});

app.use("/add-product", (req, res, next) => {
  console.log("Another the middleware!");
  res.send(`<h1>The "Added Product"</h1>`);
});

app.use(`/`, (req, res, next) => {
  console.log("Another the middleware!");
  res.send("<h1>Hello from Express!</h1>");
});

app.listen(3000);

/**
 * app.listen() does the same thing below 
 const server = http.createServer(app);
 server.listen(3000);
 */

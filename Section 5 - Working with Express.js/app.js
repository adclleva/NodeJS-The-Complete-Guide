// this file just spins up the server

// http is a global module
const http = require("http");

// express.js is all about middleware
const express = require("express");

const app = express();

// middle ware function
// next is a function
app.use((req, res, next) => {
  console.log("In the middleware!");
  next(); // Allows the request to continue to the next middleware in line
});

app.use((req, res, next) => {
  console.log("Another the middleware!");
});
// server callback function
const server = http.createServer(app);

server.listen(3000);

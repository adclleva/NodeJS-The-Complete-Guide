// this file just spins up the server

// express.js is all about middleware, that executes from top to bottom
const express = require("express");

const app = express();

// middleware function
// next is a function
app.use((req, res, next) => {
  console.log("In the middleware!");
  next(); // Allows the request to continue to the next middleware in line
});

app.use((req, res, next) => {
  console.log("Another the middleware!");
  res.send("<h1>Hello from Express!</h1>");
});

app.listen(3000);

/**
 * app.listen() does the same thing below 
 const server = http.createServer(app);
 server.listen(3000);
 */

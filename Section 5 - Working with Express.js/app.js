// this file just spins up the server

// express.js is all about middleware, that executes from top to bottom
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: true }));

// app.use() middleware function
// next is a function
app.use("/", (req, res, next) => {
  console.log("This always runs!");
  next();
});

app.use(adminRoutes);
app.use(shopRoutes);

app.listen(3000);

/**
 * app.listen() does the same thing below 
 const server = http.createServer(app);
 server.listen(3000);
 */

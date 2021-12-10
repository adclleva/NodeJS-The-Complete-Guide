const path = require("path");

// this file just spins up the server

// express.js is all about middleware, that executes from top to bottom
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: true }));

// to serve static files of the folder that we want to grant Read access to
// in this case we want to serve the files within the public folder to access the css
app.use(express.static(path.join(__dirname, "public")));

// app.use() middleware function
// next is a function
app.use("/", (req, res, next) => {
  console.log("This always runs!");
  next();
});

// this appends the /admin to the routes within the file
app.use("/admin", adminRoutes);
app.use(shopRoutes);

// a catch all route when the url doesn't match anything
app.use((req, res, next) => {
  // res.status(404).send("<h1>Page not found</h1>");
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000);

/**
 * app.listen() does the same thing below 
 const server = http.createServer(app);
 server.listen(3000);
 */

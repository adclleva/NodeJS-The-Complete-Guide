const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorsController = require("./controllers/error");

const app = express();

// app.engine(
//   "handlebars",
//   expressHandleBars({ layoutsDirectory: "views/layouts", defaultLayout: "main-layout", extname: "handlebars" })
// );

// uses express to compile dynamic templates with any html template engine
// app.set("view engine", "handlebars");

app.set("view engine", "ejs");

// to show us where to find the templates
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

app.listen(3000);

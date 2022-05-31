const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const mongoConnect = require("./util/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
// const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// remember that this line only runs as middleware for incoming requests
app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     // user is a sequalized object from the db
  //     // user from the request is null by default by the way we currently have it
  //     req.user = user;
  //     // this allows us to store the user in any of our requests
  //     next();
  //   })
  //   .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
// app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect((client) => {
  console.log("client", client);
  app.listen(3000);
});

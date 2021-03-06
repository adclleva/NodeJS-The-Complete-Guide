const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");

// models
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// remember that this line only runs as middleware for incoming requests
app.use((req, res, next) => {
  User.findById("62a1177c8368104cec55dc29") // our generated user id
    .then((user) => {
      // user from the request is null by default by the way we currently have it
      req.user = user;
      // this allows us to store the user in any of our requests
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect("mongodb+srv://arvin:mongodb123%21@cluster0.996hxxe.mongodb.net/shop?retryWrites=true&w=majority")
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        // here we create a new user whenever we start our server if no user exists
        const user = new User({
          name: "Arvin",
          email: "arvin@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

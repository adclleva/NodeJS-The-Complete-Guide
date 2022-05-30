const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const Product = require("./models/product");
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
  User.findByPk(1)
    .then((user) => {
      // user is a sequalized object from the db
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

// adding the association relationships
Product.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE", // if we delete a User, it will delete the products
});

User.hasMany(Product);

// syncs models that was defined and creates the tables for them
sequelize
  // .sync()
  .sync({ force: true }) // we don't do this in production since we don't want to overwrite prod data all the time
  .then((result) => {
    return User.findByPk(1);
    // app.listen(3000);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Arvin", email: "test@test.com" });
    }

    // we want to return a promise for consistency
    // this statement is the same thing since returning a value within
    // a then block with return a promise
    // return Promise.resolve(user)
    return user;
  })
  .then((user) => {
    // console.log(user);
    app.listen(3000);
  })
  .catch((err) => console.log(err));

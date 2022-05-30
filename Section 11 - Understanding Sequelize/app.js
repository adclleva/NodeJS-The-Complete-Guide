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
  .sync({ force: true }) // we don't do this in production since we don't want to overwrite prod data all the time
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));

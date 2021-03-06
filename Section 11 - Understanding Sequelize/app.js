const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");

// models
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

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
User.hasMany(Product); // the inverse of the relation about which isn't necessary

// these two are synonymous as one direction is enough
User.hasOne(Cart);
Cart.belongsTo(User);

// many to many relationship
Cart.belongsToMany(Product, { through: CartItem }); // through is how the relationship is linked
Product.belongsToMany(Cart, { through: CartItem });

// one to many relationship
Order.belongsTo(User);
User.hasMany(Order);

// many to many relationship
Order.belongsToMany(Product, { through: OrderItem }); // related with the in-between table within the order item table
Product.belongsToMany(Order, { through: OrderItem });

// syncs models that was defined and creates the tables for them
sequelize
  // .sync({ force: true }) // <- we don't do this in production since we don't want to overwrite prod data all the time
  .sync()
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
    // we also want to create a cart for the user
    return user.createCart();
  })
  .then((cart) => {
    // console.log(cart);
    app.listen(3000); // this is to bind and listen to the connections to the specified host and port
  })
  .catch((err) => console.log(err));

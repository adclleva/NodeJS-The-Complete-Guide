const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

// utility method
userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((item) => item.productId.toString() === product._id.toString());

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  // if cart exists
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({ productId: product._id, quantity: newQuantity });
  }

  // for adding a new item
  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;

  // using mongoose's save method
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;

// const ObjectId = mongodb.ObjectId;
// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // {items: []}
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((item) => item.productId.toString() === product._id.toString());

//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     // if cart exists
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({ productId: new ObjectId(product._id), quantity: 1 });
//     }

//     // for adding a new item
//     const updatedCart = {
//       items: updatedCartItems,
//     };

//     const db = getDb();

//     // this will only update the cart data within the user will be updated and have everything else stay the same
//     return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
//   }

//   getCart() {
//     const db = getDb();

//     const productIds = this.cart.items.map((item) => item.productId);

//     // we are telling mongodb to find a document(s) where the _id is within these productIds by using the $in operator
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((product) => {
//           return {
//             ...product,
//             // this.cart refers to the overall User class when called within this function
//             quantity: this.cart.items.find((item) => {
//               return item.productId.toString() === product._id.toString();
//             }).quantity,
//           };
//         });
//       })
//       .catch((err) => console.log(err));
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter((item) => {
//       return item.productId.toString() !== productId.toString();
//     });

//     const db = getDb();

//     return db
//       .collection("users")
//       .updateOne({ _id: ObjectId(this._id) }, { $set: { cart: { items: updatedCartItems } } });
//   }

//   addOrder() {
//     const db = getDb();

//     // we call the class method to work with this data
//     // we first get the cart items to get the products so we can use the document object that we created
//     // to insert into the mongodb a single document to the collection
//     // then we update and clear the cart
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         // we want to clear the cart after an order has been made
//         this.cart = { items: [] };

//         return db.collection("users").updateOne({ _id: ObjectId(this._id) }, { $set: { cart: { items: [] } } });
//       })
//       .catch((err) => console.log(err));
//   }

//   getOrders() {
//     const db = getDb();

//     // we find the orders based on the user's match _id
//     return db
//       .collection("orders")
//       .find({ "user._id": new ObjectId(this._id) })
//       .toArray();
//   }

//   static findById(userId) {
//     const db = getDb();

//     // return db.collection('users').find({_id: }).next() <-- this is an alternative
//     return db
//       .collection("users")
//       .findOne({ _id: new ObjectId(userId) })
//       .then((user) => {
//         console.log(user);
//         return user;
//       })
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = User;

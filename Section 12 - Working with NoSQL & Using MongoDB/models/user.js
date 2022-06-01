const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    // const cartProduct = this.cart.items.findIndex((item) => item.id === product.id);

    // for adding a new item
    const updatedCart = {
      items: [{ productId: new ObjectId(product.id), quantity: 1 }],
    };

    const db = getDb();

    // this will only update the cart data within the user will be updated and have everything else stay the same
    return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
  }

  static findById(userId) {
    const db = getDb();

    // return db.collection('users').find({_id: }).next() <-- this is an alternative
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;

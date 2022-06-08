const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// the _id gets created automatically through mongoose
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    requried: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

// first argument is used for naming the collection in th database
module.exports = mongoose.model("Product", productSchema);

// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null; // needed for the save operation
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOperation;
//     if (this._id) {
//       // update product
//       // updated one first finds the document where the _id matches the mondb objectId
//       // then uses the $set operdator to replace the values of the matched document
//       dbOperation = db.collection("products").updateOne({ _id: this._id }, { $set: this });
//     } else {
//       // create product
//       dbOperation = db.collection("products").insertOne(this);
//     }

//     return dbOperation
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => console.log(err));
//   }

//   static fetchAll() {
//     const db = getDb();

//     // the mongodb find method returns a cursor which is the documents that match the query criteria
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         console.log("products", products);
//         return products;
//       })
//       .catch((err) => console.log(err));
//   }

//   static findById(productId) {
//     const db = getDb();
//     return (
//       db
//         .collection("products")
//         // we do this because mongodb holds id's as a mongodb specific data type
//         .find({ _id: new mongodb.ObjectId(productId) })
//         .next()
//         .then((product) => {
//           console.log(product);
//           return product;
//         })
//         .catch((err) => console.log(err))
//     );
//   }

//   static deleteById(productId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: mongodb.ObjectId(productId) })
//       .then((result) => console.log("Deleted"))
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = Product;

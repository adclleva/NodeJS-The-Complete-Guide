const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();

    // the mongodb find method returns a cursor which is the documents that match the query criteria
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log("products", products);
        return products;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
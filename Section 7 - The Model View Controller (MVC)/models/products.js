const fs = require("fs");
const path = require("path");

const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "products.json");

const getProductsFromFile = (cb) => {
  // reads the entire files content of a file
  // since we are using an arrow function, 'this' would be referred to this class
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};
module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    // we use an array function to make sure `this` refers to the object of this class
    getProductsFromFile((products) => {
      products.push(this);

      // to save to the file
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  // we use a callback to handle the asynchronous nature of these calls
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};

const fs = require("fs");
const path = require("path");

const rootDir = require("../util/path");
module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    const p = path.join(rootDir, "data", "products.json");

    // reads the entire files content of a file
    // since we are using an arrow function, 'this' would be referred to this class
    fs.readFile(p, (err, filesContent) => {
      // console.log(filesContent);
      let products = [];

      if (!err) {
        // our filesContent will be a JSON and we need to parse it
        products = JSON.parse(filesContent);
      }

      products.push(this);

      // to save to the file
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll() {
    const p = path.join(rootDir, "data", "products.json");

    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return [];
      }

      return JSON.parse(fileContent);
    });
  }
};

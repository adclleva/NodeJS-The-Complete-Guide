const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect("mongodb+srv://arvin:mongodb123%21@cluster0.996hxxe.mongodb.net/?retryWrites=true&w=majority")
    .then((client) => {
      console.log("Connected!");
      callback(client);
    })
    .catch((err) => console.log(err));
};

module.exports = mongoConnect;

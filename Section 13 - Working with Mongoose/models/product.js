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
  userId: {
    type: Schema.Types.ObjectId,
    // ref references to the User schema model to have the relation set up
    ref: "User",
    required: true,
  },
});

// first argument is used for naming the collection in th database
module.exports = mongoose.model("Product", productSchema);

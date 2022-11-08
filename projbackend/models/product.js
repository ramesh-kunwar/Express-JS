const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required,
    maxlength: 32,
  },
  description: {
    type: String,
    trim: true,
    required,
    maxlength: 2000,
  },
  price: {
    type: Number,
    required,
    maxlength: 32,
    trim: true,
  },
  category: {
    type: ObjectId,
    // Where ObjectId is comming
    ref: "Category", // where you are pulling from
    required: true,
  },
  stock: {
    type: Number,
  },
  sold: {
    type: Number,
    default: 0,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
});

mongoose.model = mongoose.export("Product", productSchema);

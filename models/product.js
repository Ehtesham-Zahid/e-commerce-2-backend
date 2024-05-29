const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  imageUrls: [{ type: String, required: true }],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

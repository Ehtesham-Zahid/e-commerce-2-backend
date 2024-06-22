const mongoose = require("mongoose");

const colorVariationSchema = new mongoose.Schema({
  color: { type: String },
  imageUrls: [{ type: String, required: true }],
  sizes: [
    {
      size: { type: String },
      stock: { type: Number },
    },
  ],
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  variations: [colorVariationSchema],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

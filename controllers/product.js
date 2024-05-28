const Product = require("../models/product");
const catchAsync = require("./../utils/catchAsync");

exports.createProduct = catchAsync(async (req, res, next) => {
  const { title, color, description, price, category } = req.body;
  const createdProduct = new Product({
    title,
    color,
    description,
    price,
    category,
  });
  await createdProduct.save();
  res
    .status(201)
    .json({ createdProduct: createdProduct.toObject({ getters: true }) });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const allProducts = await Product.find({});

  res.json({
    allProducts: allProducts.map((product) =>
      product.toObject({ getters: true })
    ),
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params; // Assuming you're passing the product ID in the request parameters
  // Find the product by ID
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { title, price, description, color, category } = req.body;

  // Find the product by ID
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  // Update the product data
  product.title = title;
  product.price = price;
  product.description = description;
  product.color = color;
  product.category = category;

  // Save the updated product
  const updatedProduct = await product.save();

  res.json(updatedProduct.toObject({ getters: true }));
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params; // Assuming you're passing the product ID in the request parameters

  // Find the product by ID and delete it
  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json({ message: "Product deleted successfully" });
});

// Controller to get products of a specific category
exports.getProductsByCategory = catchAsync(async (req, res) => {
  const category = req.params.category;
  const products = await Product.find({ category });
  res.status(200).json(products);
});

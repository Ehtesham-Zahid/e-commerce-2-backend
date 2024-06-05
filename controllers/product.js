const Product = require("../models/product");
const catchAsync = require("./../utils/catchAsync");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dcbjngmhn",
  api_key: "665934251338653",
  api_secret: "oIwQNFFVAD1zJI6OAIskq2ie8uk",
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const { title, description, price, category } = req.body;
  let variations;

  try {
    variations = JSON.parse(req.body.variations);
  } catch (error) {
    return res.status(400).json({ error: "Invalid variations format" });
  }

  // Handle image uploads
  let imgUrls = [];
  if (req.files && req.files.img) {
    try {
      imgUrls = await Promise.all(
        req.files.img.map(async (image) => {
          return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(image.tempFilePath, (err, result) => {
              if (err) {
                console.error(err);
                reject("Error uploading image to Cloudinary");
              } else {
                resolve(result.url);
              }
            });
          });
        })
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Construct variations with image URLs
  const colorVariations = variations.map((variation, index) => ({
    ...variation,
    imageUrls: imgUrls[index] ? [imgUrls[index]] : [],
  }));

  // Create the product with variations
  const createdProduct = new Product({
    title,
    price,
    category,
    description,
    variations: colorVariations,
  });

  // Save the product to the database
  await createdProduct.save();

  res
    .status(201)
    .json({ createdProduct: createdProduct.toObject({ getters: true }) });
});

// exports.createProduct = catchAsync(async (req, res, next) => {
//   const { title, color, description, price, category } = req.body;

//   // Check if an image file is included in the request
//   let imgUrls = [];
//   if (req.files && req.files.img) {
//     try {
//       // Upload the images to Cloudinary
//       imgUrls = await Promise.all(
//         req.files.img.map(async (image) => {
//           return new Promise((resolve, reject) => {
//             cloudinary.uploader.upload(image.tempFilePath, (err, result) => {
//               if (err) {
//                 console.error(err);
//                 reject("Error uploading image to Cloudinary");
//               } else {
//                 console.log(result);
//                 resolve(result.url);
//               }
//             });
//           });
//         })
//       );
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ error: error.message });
//     }
//   }

//   // Create the product with uploaded image URLs
//   const createdProduct = new Product({
//     title,
//     color,
//     imageUrls: imgUrls,
//     description,
//     price,
//     category,
//   });

//   // Save the product to the database
//   await createdProduct.save();

//   // Send response
//   res
//     .status(201)
//     .json({ createdProduct: createdProduct.toObject({ getters: true }) });
// });

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const allProducts = await Product.find({});

  res.json({
    allProducts: allProducts.map((product) =>
      product.toObject({ getters: true })
    ),
  });
});

exports.getProductsByCategory = catchAsync(async (req, res, next) => {
  const category = req.params.category;
  const productsByCategory = await Product.find({ category });

  res.json({
    products: productsByCategory.map((product) =>
      product.toObject({ getters: true })
    ),
  });
});

exports.getProductWithColorVariant = catchAsync(async (req, res, next) => {
  const { id, color } = req.params; // Assuming you're passing the product ID and color in the request parameters

  // Find the product by ID
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Filter the product's variations to find the one that matches the specified color
  const variant = product.variations.find(
    (variation) => variation.color === color
  );

  if (!variant) {
    return res.status(404).json({ error: "Color variant not found" });
  }

  // Create a new product object with only the matched variant
  const productWithVariant = {
    ...product.toObject(),
    variations: [variant], // Only include the matched variant
  };

  res.json(productWithVariant);
});

// const catchAsync = require("./path/to/catchAsync");
// const Product = require("./path/to/productModel"); // Adjust the path to your Product model

exports.getProductsByVariants = catchAsync(async (req, res, next) => {
  const productsRequest = req.body; // Assuming you are sending the array in the request body

  if (!Array.isArray(productsRequest)) {
    return res.status(400).json({ error: "Invalid request format" });
  }

  const productsResponse = await Promise.all(
    productsRequest.map(async (productReq) => {
      const [id, color] = productReq.product.split("/");
      const selectedSize = productReq.selectedSize;

      // Find the product by ID
      const product = await Product.findById(id);

      if (!product) {
        return { id, color, error: "Product not found" };
      }

      // Find the specific color variant
      const variant = product.variations.find(
        (variation) => variation.color === color
      );

      if (!variant) {
        return { id, color, error: "Color variant not found" };
      }

      // Check for the selected size
      const size = variant.sizes.find((size) => size.size === selectedSize);

      if (!size) {
        return { id, color, selectedSize, error: "Size not found" };
      }

      return {
        ...product.toObject(),
        variations: [variant],
        selectedSize: selectedSize,
        // stock: size.stock,
      };
    })
  );

  res.json(productsResponse);
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

exports.getProductByIdAndColor = catchAsync(async (req, res, next) => {
  const { id, color } = req.params;

  const product = await Product.findOne({
    _id: id,
    "variations.color": color,
  });

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

// // Controller to get products of a specific category
// exports.getProductsByCategory = catchAsync(async (req, res) => {
//   const category = req.params.category;
//   const products = await Product.find({ category });
//   res.status(200).json(products);
// });

const express = require("express");
const router = express.Router();

const productControllers = require("../controllers/product");
const authControllers = require("../controllers/auth");

router.get("/:id", productControllers.getProduct);

router.get("/category/:category", productControllers.getProductsByCategory);

router.get("/:id/:color", productControllers.getProductByIdAndColor);

router.get("/", productControllers.getAllProducts);

router.post(
  "/",
  authControllers.protect,
  authControllers.restrictTo("admin"),
  productControllers.createProduct
);

router.put(
  "/:id",
  authControllers.protect,
  authControllers.restrictTo("admin"),
  productControllers.updateProduct
);

router.delete(
  "/:id",
  authControllers.protect,
  authControllers.restrictTo("admin"),
  productControllers.deleteProduct
);
module.exports = router;

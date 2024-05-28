const express = require("express");
const router = express.Router();

const productControllers = require("../controllers/product");
const authControllers = require("../controllers/auth");

router.get("/:id", productControllers.getProduct);

router.get("/", productControllers.getAllProducts);

router.get("/category/:category", productControllers.getProductsByCategory);

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

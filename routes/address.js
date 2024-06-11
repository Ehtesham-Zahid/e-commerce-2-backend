// routes/addressRoutes.js

const express = require("express");
const router = express.Router();

const addressControllers = require("../controllers/address");
const authControllers = require("../controllers/auth");

// Get all addresses for a user
router.get("/", authControllers.protect, addressControllers.getAddresses);

router.get(
  "/primary",
  authControllers.protect,
  addressControllers.getPrimaryAddress
);
router.get(
  "/:addressId",
  authControllers.protect,
  addressControllers.getAddress
);

// Add a new address
router.post("/", authControllers.protect, addressControllers.addAddress);

// Update an address
router.put("/:id", authControllers.protect, addressControllers.updateAddress);

// Delete an address
router.delete(
  "/:id",
  authControllers.protect,
  addressControllers.deleteAddress
);

// Set primary address
router.put(
  "/setPrimary/:id",
  authControllers.protect,
  addressControllers.setPrimaryAddress
);

module.exports = router;

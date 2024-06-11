const express = require("express");
const router = express.Router();

const orderControllers = require("../controllers/order");
const authControllers = require("../controllers/auth");

router.post(
  "/createOrderAuth",
  authControllers.protect,
  orderControllers.createOrderAuth
);

router.post("/createOrderUnAuth", orderControllers.createOrderUnAuth);

router.get("/", authControllers.protect, orderControllers.getOrders);

module.exports = router;

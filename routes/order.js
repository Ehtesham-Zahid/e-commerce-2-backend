const express = require("express");
const router = express.Router();

const orderControllers = require("../controllers/order");
const authControllers = require("../controllers/auth");

router.post("/", orderControllers.createOrder);

router.get("/", authControllers.protect, orderControllers.getOrders);

module.exports = router;

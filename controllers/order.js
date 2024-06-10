// controllers/order.js

const Order = require("../models/order");
const catchAsync = require("../utils/catchAsync");

exports.createOrder = catchAsync(async (req, res, next) => {
  const {
    paymentMethod,
    items,
    addressId,
    addressDetails,
    totalPrice,
    status,
  } = req.body;

  let orderData = {
    paymentMethod,
    items,
    totalPrice,
    // status,
    // createdAt: new Date(),
  };

  console.log(req.user);
  if (req.user) {
    // User is logged in
    if (!addressId) {
      return res
        .status(400)
        .json({ error: "Address ID is required for logged-in users" });
    }
    orderData.user = req.user._id;
    orderData.address = addressId;
  } else {
    // User is not logged in
    if (!addressDetails) {
      return res.status(400).json({
        error: "Address details are required for non-authenticated users",
      });
    }
    orderData.addressDetails = addressDetails;
  }

  const order = await Order.create(orderData);

  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.getOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find().populate("user address");
  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});

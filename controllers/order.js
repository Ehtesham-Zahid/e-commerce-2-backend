const Order = require("../models/order");
const catchAsync = require("../utils/catchAsync");

exports.createOrderAuth = catchAsync(async (req, res, next) => {
  const { paymentMethod, items, addressId, totalPrice } = req.body;

  if (!addressId) {
    return res
      .status(400)
      .json({ error: "Address ID is required for logged-in users" });
  }

  let paymentStatus;
  if (paymentMethod === "Card") {
    paymentStatus = "Fulfilled";
  } else {
    paymentStatus = "Pending";
  }

  const orderData = {
    paymentMethod,
    paymentStatus,
    items,
    totalPrice,
    user: req.user._id,
    address: addressId,
  };

  const order = await Order.create(orderData);

  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.createOrderUnAuth = catchAsync(async (req, res, next) => {
  const {
    paymentMethod,
    // items,
    addressDetails,
    totalPrice,
  } = req.body;

  if (!addressDetails) {
    return res.status(400).json({
      error: "Address details are required for non-authenticated users",
    });
  }

  let paymentStatus;
  if (paymentMethod === "Card") {
    paymentStatus = "Fulfilled";
  } else {
    paymentStatus = "Pending";
  }

  const orderData = {
    paymentMethod,
    paymentStatus,
    // items,
    totalPrice,
    addressDetails,
  };

  const order = await Order.create(orderData);

  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.getOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "user address"
  );
  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});

// models/order.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: false,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    // required: false,
  },
  addressDetails: {
    firstName: String,
    lastName: String,
    phoneNumber: String,
    city: String,
    address: String,
    zipcode: String,
    country: String,
    // required: false,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  status: {
    type: String,
    default: "Pending",
  },
  paymentStatus: {
    type: String,
    default: "Pending",
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);

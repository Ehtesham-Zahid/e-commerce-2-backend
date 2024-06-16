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
    email: String,
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
  // items: [
  //   {
  //     product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  //     quantity: Number,
  //   },
  // ],
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
  orderNumber: {
    type: String,
    unique: true,
  },
});

// Function to generate random order number
const generateOrderNumber = () => {
  const randomNumber = Math.floor(Math.random() * 9000000) + 1000000;
  return `#${randomNumber}`;
};

// Pre-save middleware to generate order number
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = generateOrderNumber();
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);

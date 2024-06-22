const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
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
  },
  paymentMethod: {
    type: String,
    required: true,
  },

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

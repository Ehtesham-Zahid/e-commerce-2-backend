const express = require("express");
const router = express.Router();

const orderControllers = require("../controllers/order");
const authControllers = require("../controllers/auth");

const stripe = require("stripe")(process.env.STRIPE_SECRET);

router.post(
  "/createOrderAuth",
  authControllers.protect,
  orderControllers.createOrderAuth
);

router.post("/createOrderUnAuth", orderControllers.createOrderUnAuth);

router.get("/", authControllers.protect, orderControllers.getOrders);

router.post("/create-checkout-session", async (req, res) => {
  const { products } = req.body;
  const lineItems = products?.map((product) => ({
    price_data: {
      currency: "pkr",
      product_data: {
        name: product.title,
        images: [product.variations[0].imageUrls[0]],
      },
      unit_amount: product.price * 100,
    },
    quantity: product.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url:
        "https://e-commerce-2-frontend.vercel.app/order-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://e-commerce-2-frontend.vercel.app/order-cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

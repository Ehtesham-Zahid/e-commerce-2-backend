const express = require("express");
const router = express.Router();

const authControllers = require("../controllers/auth");

router.get("/country", (req, res) => {
  res.json({ country: req.country });
});

router.post("/signup", authControllers.signup);
router.post("/login", authControllers.login);

router.post("/forgotPassword", authControllers.forgotPassword);
router.patch("/resetPassword/:token", authControllers.resetPassword);

module.exports = router;

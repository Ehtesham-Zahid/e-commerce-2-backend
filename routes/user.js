const express = require("express");
const router = express.Router();

// const userControllers = require("../controllers/user");
const authControllers = require("../controllers/auth");

router.get("/country", (req, res) => {
  res.json({ country: req.country });
});

router.post("/signup", authControllers.signup);
router.post("/login", authControllers.login);

router.post("/forgotPassword", authControllers.forgotPassword);
router.patch("/resetPassword/:token", authControllers.resetPassword);

router.patch(
  "/updateMyPassword",
  authControllers.protect,
  authControllers.updatePassword
);

// router.patch(
//   "/updateMe",
//   authControllers.protect,
//   userControllers.uploadUserPhoto,
//   userControllers.resizeUserPhoto,
//   userControllers.updateMe
// );

// router.delete("/deleteMe", authControllers.protect, userControllers.deleteMe);

// router
//   .route("/")
//   .get(
//     authControllers.protect,
//     authControllers.restrictTo("admin"),
//     userControllers.getAllUsers
//   )
//   .post(userControllers.createUser);

// router
//   .route("/:id")
//   .get(authControllers.protect, userControllers.getSingleUser)
//   .patch(
//     authControllers.protect,
//     authControllers.restrictTo("admin"),
//     userControllers.updateUser
//   )
//   .delete(
//     authControllers.protect,
//     authControllers.restrictTo("admin"),
//     userControllers.deleteUser
//   );

module.exports = router;

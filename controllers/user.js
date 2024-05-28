// // const multer = require("multer");
// const sharp = require("sharp");

// const User = require("../models/user");
// const Review = require("../models/review");
// const AppError = require("../utils/appError");
// const catchAsync = require("../utils/catchAsync");

// // const multerStorage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, "Public/img/users");
// //   },
// //   filename: (req, file, cb) => {
// //     // user-83749294855748903030-8484939303030385.jpeg
// //     const ext = file.mimetype.split("/")[1];
// //     cc(null, `user-${req.user.id}-${Date.now()}.${ext}`);
// //   },
// // });

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new AppError("Not an image! Please upload only images.", 400), false);
//   }
// };

// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// exports.uploadUserPhoto = upload.single("photo");

// exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat("jpeg")
//     .jpeg({ quality: 90 })
//     .toFile(`Uploads/${req.file.filename}`);
//   next();
// });

// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach((el) => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });
//   return newObj;
// };

// exports.updateMe = catchAsync(async (req, res, next) => {
//   // 1) Create error If user POSTs password data
//   if (req.body.password || req.body.passwordConfirm) {
//     return next(
//       new AppError(
//         "This route is not for password updates. Please use /updateMyPassword.",
//         400
//       )
//     );
//   }

//   // 2) Filtered out unwanted fields names that are not allowed to be updated
//   const filteredBody = filterObj(
//     req.body,
//     "username",
//     "email",
//     "shippingAddress",
//     "phoneNumber",
//     "country"
//   );
//   if (req.file) filteredBody.photo = req.file.filename;

//   // 3) Update user document
//   const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
//     new: true,
//     runValidators: true,
//   });

//   res.status(200).json({
//     status: "success",
//     data: {
//       user: updatedUser,
//     },
//   });
// });

// exports.deleteMe = catchAsync(async (req, res, next) => {
//   // Delete reviews associated with the user
//   await Review.deleteMany({ user: req.user._id });

//   await User.findByIdAndUpdate(req.user._id, { active: false });

//   res.status(204).json({ status: "success", data: null });
// });

// exports.createUser = async (req, res, next) => {
//   res.status(500).json({
//     status: "error",
//     message: "This route is not yet defined!",
//   });
// };

// // Controller function to get all users
// exports.getAllUsers = catchAsync(async (req, res) => {
//   const users = await User.find();

//   res.status(200).json(users);
// });

// exports.getSingleUser = catchAsync(async (req, res, next) => {
//   const userId = req.params.id;

//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({ error: "User not found." });
//   }

//   res.status(200).json(user);
// });

// exports.updateUser = catchAsync(async (req, res, next) => {
//   const userId = req.params.id;
//   const updateData = req.body;

//   // Check if the user exists in the database
//   const existingUser = await User.findById(userId);
//   if (!existingUser) {
//     return res.status(404).json({ error: "User not found." });
//   }

//   // Update the user's data based on the fields sent in the request body
//   for (const [key, value] of Object.entries(updateData)) {
//     if (key in existingUser) {
//       existingUser[key] = value;
//     }
//   }

//   // Save the updated user
//   const updatedUser = await existingUser.save({ validateBeforeSave: false });
//   res.status(200).json(updatedUser);
// });

// exports.deleteUser = catchAsync(async (req, res, next) => {
//   const userId = req.params.id;

//   // Check if the user exists in the database
//   const user = await User.findById(userId);
//   if (!user) {
//     return res.status(404).json({ error: "User not found." });
//   }

//   // Delete the user
//   await user.deleteOne();

//   res.status(200).json({ message: "User deleted successfully." });
// });

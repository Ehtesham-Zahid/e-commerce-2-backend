const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const globalErrorHandler = require("./controllers/error");
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");

const AppError = require("./utils/appError");

// 1.) GLOBAL MIDDLEWARES

// CORS HEADERS
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Increase payload size limit to 10MB
app.use(express.json({ limit: "10mb" }));

// Limit requests from same IP

const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

// Body Parser, reading data from body into req.body
app.use(bodyParser.json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(compression());

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// 2) ROUTES

app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/users", userRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

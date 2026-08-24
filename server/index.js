// dependencies
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser")
const cors = require("cors")

const authRouter = require("./src/routes/auth.routes");
const userRouter = require("./src/routes/users.routes");
const companyRouter = require("./src/routes/company.routes");
const productRouter = require("./src/routes/product.routes");
const categoryRouter = require("./src/routes/category.routes");
const distributorRouter = require("./src/routes/distributor.routes");

const app = express();

// CORS
app.use(
      cors({
            origin: [
                  "http://localhost:3000",
                  "https://smartrepresentative.vercel.app/",
            ],
            credentials: true,
      })
);

// middlewares
app.use(express.json());
app.use(express.urlencoded())
app.use(express.text())
app.use(express.raw())
app.use(cookieParser())

// routes 
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/company", companyRouter);
app.use("/api/products", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/distributor-products", distributorRouter);

// configuration
dotenv.config();
const config = {
      port: process.env.PORT,
      uri: process.env.DB_URI,
};

// database connections
mongoose
      .connect(config.uri)
      .then(() => {
            console.log(`database connected successfully.`);
      })
      .catch((err) => {
            console.log(`database connection failed!`, err);
      });

app.get("/", (req, res) => {
      res.status(200).json({
            success: true,
            message: "server is running...",
            timestamp: new Date().toISOString(),
            routes: {
                  auth: "/api/auth",
                  users: "/api/users",
                  company: "/api/company",
                  products: "/api/products",
                  category: "/api/category",
                  distributorProducts: "/api/distributor-products",
            }
      })
});

// listening port
app.listen(config.port, () =>
      console.log(`server running on port ${config.port}`),
);

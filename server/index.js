// dependencies
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRouter = require("./src/routes/auth.routes");
const userRouter = require("./src/routes/users.routes");
const companyRouter = require("./src/routes/company.routes");
const productRouter = require("./src/routes/product.routes");
const categoryRouter = require("./src/routes/category.routes");
const app = express();

// middlewares
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/company", companyRouter);
app.use("/api/products", productRouter);
app.use("/api/category", categoryRouter);

// configuration
dotenv.config();
const config = {
      port: process.env.PORT,
      uri: process.env.DB_URI,
};

// databse connections
mongoose
      .connect(config.uri)
      .then(() => {
            console.log(`database connected successfully.`);
      })
      .catch((err) => {
            console.log(`database connection failed!`, err);
      });

app.get("/", (req, res) => {
      res.send(`hello postman`);
});

// listening port
app.listen(config.port, () =>
      console.log(`server running on port ${config.port}`),
);

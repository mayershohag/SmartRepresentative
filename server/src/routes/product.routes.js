const express = require("express");
const productRouter = express.Router();
// const getCompanyProduct = require("../controllers/product/getCompanyProduct");
const createProduct = require("../controllers/product/createProduct");

// productRouter.get("/", getCompanyProduct);
productRouter.post("/", createProduct);

module.exports = productRouter;

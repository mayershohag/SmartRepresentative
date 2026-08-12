const express = require("express");
const productRouter = express.Router();
const createProduct = require("../controllers/product/createProduct");
const getProducts = require("../controllers/product/getProducts");
const getProduct = require("../controllers/product/getProduct");
const updateProduct = require("../controllers/product/updateProduct");
const deleteProduct = require("../controllers/product/deleteProduct");

productRouter.post("/", createProduct);
productRouter.get("/", getProducts);
productRouter.get("/:productId", getProduct);
productRouter.put("/:productId", updateProduct);
productRouter.delete("/:productId", deleteProduct);

module.exports = productRouter;

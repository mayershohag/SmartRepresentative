const express = require("express");
const productRouter = express.Router();
const createProduct = require("../controllers/product/createProduct");
const getProducts = require("../controllers/product/getProducts");
const getProduct = require("../controllers/product/getProduct");
const updateProduct = require("../controllers/product/updateProduct");
const deleteProduct = require("../controllers/product/deleteProduct");
const authValidator = require("../middlewares/common/authValidator");
const roleChecker = require("../middlewares/common/roleChecker");

productRouter.post("/", authValidator, roleChecker, createProduct);
productRouter.get("/", authValidator, roleChecker, getProducts);
productRouter.get("/:productId", authValidator, roleChecker, getProduct);
productRouter.put("/:productId", authValidator, roleChecker, updateProduct);
productRouter.delete("/:productId", authValidator, roleChecker, deleteProduct);

module.exports = productRouter;

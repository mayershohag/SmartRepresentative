const express = require("express");
const authValidator = require("../middlewares/common/authValidator");
const roleChecker = require("../middlewares/common/roleChecker");
const createDistributorProduct = require("../controllers/distributorProducts/createDistributorProduct");
const getDistributorProducts = require("../controllers/distributorProducts/getDistributorProducts");
const getSingleProduct = require("../controllers/distributorProducts/getSingleProduct");
const updateDistributorProduct = require("../controllers/distributorProducts/updateDistributorProduct");
const deleteDistributorProduct = require("../controllers/distributorProducts/deleteDistributorProduct");

const distributorProductsRouter = express.Router();

distributorProductsRouter.post("/", authValidator, roleChecker, createDistributorProduct);
distributorProductsRouter.get("/my-products", authValidator, roleChecker, getDistributorProducts);
distributorProductsRouter.get("/my-products/:productId", authValidator, roleChecker, getSingleProduct);
distributorProductsRouter.put("/my-products/:productId", authValidator, roleChecker, updateDistributorProduct);
distributorProductsRouter.delete("/my-products/:productId", authValidator, roleChecker, deleteDistributorProduct);

module.exports = distributorProductsRouter;

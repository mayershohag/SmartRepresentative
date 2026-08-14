const express = require("express");
const authValidator = require("../middlewares/common/authValidator");
const roleChecker = require("../middlewares/common/roleChecker");
const createDistributorProduct = require("../controllers/distributor/createDistributorProduct");
const getDistributorProducts = require("../controllers/distributor/getDistributorProducts");
const getSingleProduct = require("../controllers/distributor/getSingleProduct");
const updateDistributorProduct = require("../controllers/distributor/updateDistributorProduct");
const deleteDistributorProduct = require("../controllers/distributor/deleteDistributorProduct");

const distributorRouter = express.Router();

distributorRouter.post("/", authValidator, roleChecker, createDistributorProduct);
distributorRouter.get("/my-products", authValidator, roleChecker, getDistributorProducts);
distributorRouter.get("/my-products/:productId", authValidator, roleChecker, getSingleProduct);
distributorRouter.put("/my-products/:productId", authValidator, roleChecker, updateDistributorProduct);
distributorRouter.delete("/my-products/:productId", authValidator, roleChecker, deleteDistributorProduct);

module.exports = distributorRouter;

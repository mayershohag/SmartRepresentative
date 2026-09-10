const express = require("express");
const getDistributors = require("../../controllers/user/distributor/getDistributors");
const getDistributor = require("../../controllers/user/distributor/getDistributor");
const updateDistributor = require("../../controllers/user/distributor/updateDistributor");
const deleteDistributor = require("../../controllers/user/distributor/deleteDistributor");
const distributorRouter = express.Router();

distributorRouter.get("/", getDistributors);
distributorRouter.get("/:id", getDistributor);
distributorRouter.put("/:id", updateDistributor);
distributorRouter.delete("/:id", deleteDistributor);

module.exports = distributorRouter;

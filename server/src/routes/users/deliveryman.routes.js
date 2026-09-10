const express = require("express");
const allDeliveryman = require("../../controllers/user/deliveryman/allDeliveryman");
const getDeliveryman = require("../../controllers/user/deliveryman/getDeliveryman");
const updateDeliveryman = require("../../controllers/user/deliveryman/updateDeliveryman");
const deleteDeliveryman = require("../../controllers/user/deliveryman/deleteDeliveryman");

const deliverymanRouter = express.Router()

deliverymanRouter.get("/", allDeliveryman);
deliverymanRouter.get("/:id", getDeliveryman);
deliverymanRouter.put("/:id", updateDeliveryman);
deliverymanRouter.delete("/:id", deleteDeliveryman);


module.exports = deliverymanRouter
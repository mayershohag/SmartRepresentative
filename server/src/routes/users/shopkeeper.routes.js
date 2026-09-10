const express = require("express");
const allShopKeepers = require("../../controllers/user/shopkeeper/allShopkeepers");
const getShopkeeper = require("../../controllers/user/shopkeeper/getShopkeeper");
const updateShopkeeper = require("../../controllers/user/shopkeeper/updateShopkeeper");
const deleteShopkeeper = require("../../controllers/user/shopkeeper/deleteShopkeeper");
const shopkeeperRouter = express.Router();

shopkeeperRouter.get("/", allShopKeepers);
shopkeeperRouter.get("/:id", getShopkeeper);
shopkeeperRouter.put("/:id", updateShopkeeper);
shopkeeperRouter.delete("/:id", deleteShopkeeper);

module.exports = shopkeeperRouter;

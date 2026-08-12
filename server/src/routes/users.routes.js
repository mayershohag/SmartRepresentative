const express = require("express");
const userRouter = express.Router();
const usersController = require("../controllers/user/users");
const userController = require("../controllers/user/user");
const updateUser = require("../controllers/user/updateUser");
const deleteUser = require("../controllers/user/deleteUser");

userRouter.get("/", usersController);
userRouter.get("/:phone", userController);
userRouter.put("/:phone", updateUser);
userRouter.delete("/:phone", deleteUser);

module.exports = userRouter;

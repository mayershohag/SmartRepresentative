// dependencies
const express = require("express");
const authRouter = express.Router();
const loginAuth = require("../controllers/auth/login.auth");
const logoutAuth = require("../controllers/auth/logout.auth");
const getProfile = require("../controllers/auth/profile.auth");
const authValidator = require("../middlewares/common/authValidator");
const distributorRegister = require("../controllers/auth/distributor/register.auth");
const superAdminRegister = require("../controllers/auth/superAdmin/register.auth");
const shopkeeperRegister = require("../controllers/auth/shopkeeper/register.auth");
const deliveryRegister = require("../controllers/auth/delivery/register.auth");

// middlewares
authRouter.use(express.json());
authRouter.use((req, res, next) => {
      res.set("Cache-Control", "no-store");
      next();
});

// distributor api routes
authRouter.post("/distributor/register", distributorRegister);
authRouter.post("/distributor/login", loginAuth);

// admin api routers 
authRouter.post("/admin/register", superAdminRegister)
authRouter.post("/admin/login", loginAuth)

// delivery api routes 
authRouter.post("/delivery/register", deliveryRegister)
authRouter.post("/delivery/login", loginAuth)

// shopkeeper api routes 
authRouter.post("/shopkeeper/register", shopkeeperRegister)
authRouter.post("/shopkeeper/login", loginAuth)

// logout api 
authRouter.post("/logout", logoutAuth);

// profile api 
authRouter.get('/profile', authValidator, getProfile)

module.exports = authRouter;

// dependencies
const express = require("express");
const authRouter = express.Router();
const loginAuth = require("../controllers/auth/login.auth");
const registerAuth = require("../controllers/auth/register.auth");
const logoutAuth = require("../controllers/auth/logout.auth");
const getProfile = require("../controllers/auth/profile.auth");

// middlewares
authRouter.use(express.json());

// api routes
authRouter.post("/register", registerAuth);
authRouter.post("/login", loginAuth);
authRouter.post("/logout", logoutAuth);
authRouter.get('/profile', getProfile)

module.exports = authRouter;

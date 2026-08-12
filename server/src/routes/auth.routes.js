// dependencies
const express = require("express");
const loginAuth = require("../controllers/auth/login.auth");
const registerAuth = require("../controllers/auth/register.auth");
const authRouter = express.Router();
const logoutAuth = require("../controllers/auth/logout.auth");

// middlewares
authRouter.use(express.json());

// api routes
authRouter.post("/register", registerAuth);
authRouter.post("/login", loginAuth);
authRouter.post("/logout", logoutAuth);

module.exports = authRouter;

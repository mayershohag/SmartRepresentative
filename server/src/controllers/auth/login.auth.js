const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Distributor = require("../../models/roleBaseUser/distributor.model.js");
const SuperAdmin = require("../../models/roleBaseUser/admin.model.js");
const DeliveryMan = require("../../models/roleBaseUser/delivery.model.js");
const Shopkeeper = require("../../models/roleBaseUser/shopkeeper.model.js");

const { cookieOptions, TOKEN_MAX_AGE_MS } = require("../../utils/cookie.js");
const dotenv = require("dotenv");

dotenv.config();
const config = {
      secret_key: process.env.JWT_KEY,
      expires: process.env.JWT_EXPIRES_IN,
};

const loginAuth = async (req, res) => {
      try {
            const rolePath = req.url.replace(/^\/+|\/+$/g, "").split("/");
            const validRoles = ["distributor", "admin", "delivery", "shopkeeper"];
            const role = rolePath.find((segment) => validRoles.includes(segment.toLowerCase()));
            const { phone, password } = req.body;
            let user;

            switch (role) {
                  case "distributor":
                        user = await Distributor.findOne({ phone }).select("+password");
                        break
                  case "admin":
                        user = await SuperAdmin.findOne({ phone }).select("+password");
                        break;
                  case "delivery":
                        user = await DeliveryMan.findOne({ phone }).select("+password");
                        break;
                  case "shopkeeper":
                        user = await Shopkeeper.findOne({ phone }).select("+password");
                        break;
                  default:
                        break;
            }

            if (!phone || !password) {
                  return res.status(400).json({
                        success: false,
                        message: "all fields are required.!",
                  });
            }

            if (!user) {
                  return res.status(401).json({
                        success: false,
                        message: "Invalid phone & password",
                  });
            }

            const isPasswordMatched = await bcrypt.compare(
                  password,
                  user.password,
            );
            if (!isPasswordMatched) {
                  return res.status(401).json({
                        success: false,
                        message: "Invalid phone & password",
                  });
            }
            const token = jwt.sign(
                  {
                        userId: user.id,
                        role: user.role,
                  },
                  config.secret_key,
                  { expiresIn: config.expires },
            );

            user.password = undefined;

            res.cookie("token", token, {
                  ...cookieOptions,
                  maxAge: TOKEN_MAX_AGE_MS,
            });
            res.status(200).json({
                  success: true,
                  message: "Login successfully!",
                  user,
            });
      } catch (err) {
            console.log(err);

            return res.status(500).json({
                  success: false,
                  message: "Internal Server Error",
            });
      }
};

module.exports = loginAuth;

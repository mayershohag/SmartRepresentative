const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/user.model.js");
const { cookieOptions, TOKEN_MAX_AGE_MS } = require("../../utils/cookie.js");
const dotenv = require("dotenv");

dotenv.config();
const config = {
      secret_key: process.env.JWT_KEY,
      expires: process.env.JWT_EXPIRES_IN,
};

const loginAuth = async (req, res) => {
      try {
            const { phone, password } = req.body;

            if (!phone || !password) {
                  return res.status(400).json({
                        success: false,
                        message: "all fields are required.!",
                  });
            }

            const user = await User.findOne({ phone }).select("+password");
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

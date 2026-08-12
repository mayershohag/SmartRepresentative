const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/distributor.model");
const dotenv = require("dotenv");

dotenv.config();
const config = {
      secret_key: process.env.JWT_KEY,
      expires: process.env.JWT_EXPIRES_IN,
      secure: process.env.NODE_ENV,
};

const loginAuth = async (req, res) => {
      try {
            const { phone, password } = req.body;

            if (!phone || !password) {
                  return res.json({
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
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "strict",
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

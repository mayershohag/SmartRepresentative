const User = require("../../models/user.model.js");
const { hash } = require("bcrypt");
const registerAuth = async (req, res) => {
      try {
            const {
                  name,
                  email,
                  password,
                  photo,
                  bio,
                  businessName,
                  tradeLicense,
                  nid,
                  district,
                  address,
                  isActive,
                  phone,
            } = req.body;

            if (
                  !name ||
                  !phone ||
                  !password ||
                  !businessName ||
                  !tradeLicense ||
                  !nid ||
                  !district
            ) {
                  return res.status(400).json({
                        success: false,
                        message: "all fields are required!",
                  });
            }
            const phoneChecking = await User.findOne({ phone });
            const nidChecking = await User.findOne({ nid });
            const tradeLicenseChecking = await User.findOne({ tradeLicense });
            const hashedPassword = await hash(password, 12);

            if (phoneChecking) {
                  return res.status(409).json({
                        success: false,
                        message: "User already exists.",
                  });
            }
            if (nidChecking) {
                  return res.status(409).json({
                        success: false,
                        message: "NID already exists.",
                  });
            }
            if (tradeLicenseChecking) {
                  return res.status(409).json({
                        success: false,
                        message: "Trade License already exists.",
                  });
            }

            const user = new User({
                  name,
                  email,
                  photo,
                  bio,
                  businessName,
                  tradeLicense,
                  nid,
                  district,
                  address,
                  isActive,
                  phone,
                  password: hashedPassword,
            });
            await user.save();
            res.status(201).json({
                  success: true,
                  message: "User created Successfully!",
            });
      } catch (err) {
            console.log(err);
            res.status(500).json({
                  success: false,
                  message: "User creation failed.",
            });
      }
};
module.exports = registerAuth;

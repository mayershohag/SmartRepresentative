const Shopkeeper = require("../../../models/roleBaseUser/shopkeeper.model");
const { hash } = require("bcrypt");
const shopkeeperRegister = async (req, res) => {
      try {
            const {
                  name,
                  shopName,
                  phone,
                  password,
                  nid,
                  district,
                  shopAddress,
                  tradeLicense,
                  photo,
                  role,
                  activeStatus,
            } = req.body;

            if (
                  !name ||
                  !phone ||
                  !password ||
                  !shopName ||
                  !shopAddress ||
                  !nid ||
                  !district
            ) {
                  return res.status(400).json({
                        success: false,
                        message: "all fields are required!",
                  });
            }
            const phoneChecking = await Shopkeeper.findOne({ phone });
            const nidChecking = await Shopkeeper.findOne({ nid });
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

            const shopkeeper = new Shopkeeper({
                  name,
                  shopName,
                  phone,
                  nid,
                  district,
                  shopAddress,
                  tradeLicense,
                  photo,
                  role,
                  activeStatus,
                  password: hashedPassword,
            });
            await shopkeeper.save();
            res.status(201).json({
                  success: true,
                  message: "Shopkeeper user created Successfully!",
            });
      } catch (err) {
            console.log(err);
            res.status(500).json({
                  success: false,
                  message: "Shopkeeper user creation failed.",
            });
      }
};
module.exports = shopkeeperRegister;

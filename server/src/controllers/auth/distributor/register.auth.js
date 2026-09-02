const Distributor = require("../../../models/roleBaseUser/distributor.model.js");
const { hash } = require("bcrypt");
const distributorRegister = async (req, res) => {
      try {
            const {
                  name,
                  email,
                  password,
                  photo,
                  companies,
                  businessName,
                  tradeLicense,
                  nid,
                  district,
                  address,
                  activeStatus,
                  phone,
                  role
            } = req.body;

            if (
                  !name ||
                  !phone ||
                  !password ||
                  !businessName ||
                  !tradeLicense ||
                  !nid ||
                  !companies ||
                  !district
            ) {
                  return res.status(400).json({
                        success: false,
                        message: "all fields are required!",
                  });
            }
            const phoneChecking = await Distributor.findOne({ phone });
            const nidChecking = await Distributor.findOne({ nid });
            const tradeLicenseChecking = await Distributor.findOne({ tradeLicense });
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

            const distributor = new Distributor({
                  name,
                  email,
                  photo,
                  businessName,
                  tradeLicense,
                  nid,
                  district,
                  address,
                  activeStatus,
                  companies,
                  phone,
                  password: hashedPassword,
                  role
            });
            await distributor.save();
            res.status(201).json({
                  success: true,
                  message: "Distributor user created Successfully!",
            });
      } catch (err) {
            console.log(err);
            res.status(500).json({
                  success: false,
                  message: "Distributor user creation failed.",
            });
      }
};
module.exports = distributorRegister;

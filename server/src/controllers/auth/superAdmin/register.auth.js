const SuperAdmin = require("../../../models/roleBaseUser/admin.model");
const { hash } = require("bcrypt");
const superAdminRegister = async (req, res) => {
      try {
            const {
                  name,
                  email,
                  phone,
                  password,
                  photo,
                  role,
                  permissions,
                  activeStatus,
            } = req.body;

            if (!name || !phone || !password) {
                  return res.status(400).json({
                        success: false,
                        message: "all fields are required!",
                  });
            }
            const phoneChecking = await SuperAdmin.findOne({ phone });
            const hashedPassword = await hash(password, 12);

            if (phoneChecking) {
                  return res.status(409).json({
                        success: false,
                        message: "User already exists.",
                  });
            }

            const superAdmin = new SuperAdmin({
                  name,
                  email,
                  phone,
                  photo,
                  role,
                  permissions,
                  activeStatus,
                  password: hashedPassword,
            });
            await superAdmin.save();
            res.status(201).json({
                  success: true,
                  message: "Admin user created Successfully!",
            });
      } catch (err) {
            console.log(err);
            res.status(500).json({
                  success: false,
                  message: "Admin user creation failed.",
            });
      }
};
module.exports = superAdminRegister;

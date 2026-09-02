const DeliveryMan = require("../../../models/roleBaseUser/delivery.model");
const { hash } = require("bcrypt");
const deliveryRegister = async (req, res) => {
      try {
            const {
                  name,
                  phone,
                  password,
                  nid,
                  distributorId,
                  companies,
                  vehicleType,
                  vehicleNumber,
                  photo,
                  role,
                  address,
                  activeStatus,
            } = req.body;

            if (
                  !name ||
                  !phone ||
                  !password ||
                  !distributorId ||
                  !companies ||
                  !nid ||
                  !companies
            ) {
                  return res.status(400).json({
                        success: false,
                        message: "all fields are required!",
                  });
            }
            const phoneChecking = await DeliveryMan.findOne({ phone });
            const nidChecking = await DeliveryMan.findOne({ nid });
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

            const deliveryMan = new DeliveryMan({
                  name,
                  phone,
                  nid,
                  distributorId,
                  companies,
                  vehicleType,
                  vehicleNumber,
                  photo,
                  role,
                  address,
                  activeStatus,
                  password: hashedPassword,
            });
            await deliveryMan.save();
            res.status(201).json({
                  success: true,
                  message: "Delivery man account created Successfully!",
            });
      } catch (err) {
            console.log(err);
            res.status(500).json({
                  success: false,
                  message: "delivery man account creation failed.",
            });
      }
};
module.exports = deliveryRegister;

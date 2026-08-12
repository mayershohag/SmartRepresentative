const User = require("../../models/distributor.model");
const userController = async (req, res) => {
      try {
            const phone = req.params.phone;
            const user = await User.findOne({ phone });
            res.status(200).json({
                  success: true,
                  message: `${user?.name} Data Retrieve Successfully!`,
                  user,
            });
      } catch (err) {
            console.log(err);
            res.status(501).json({
                  success: false,
                  message: "Internal Server Error.",
            });
      }
};

module.exports = userController;

const User = require("../../models/distributor.model");
const getUsers = async (req, res) => {
      try {
            const users = await User.find();
            res.status(200).json({
                  success: true,
                  message: "All users data retrieved",
                  users,
            });
      } catch (err) {
            console.log(err);

            res.status(501).json({
                  success: false,
                  message: "Internal Server Error.",
            });
      }
};

module.exports = getUsers;

const User = require("../../models/user.model.js");
const updateUser = async (req, res) => {
      try {
            const phone = req.params.phone;
            const user = await User.findOne({ phone });

            if (!user) {
                  return res.status(404).json({
                        success: false,
                        message: "404 User Not Found!",
                  });
            }

            const updatedUser = await User.findOneAndUpdate(
                  { _id: user._id },
                  req.body,
                  {
                        returnDocument: "after",
                        runValidators: true,
                  },
            );

            res.status(200).json({
                  success: true,
                  message: `${user?.name}'s data retrieved successfully!`,
                  user: updatedUser,
            });
      } catch (err) {
            console.log(err);

            res.status(500).json({
                  success: false,
                  message: "Internal Server Error",
            });
      }
};

module.exports = updateUser;

const User = require("../../models/distributor.model");
const deleteUser = async (req, res) => {
      try {
            const phone = req.params.phone;
            const user = await User.findOne({ phone });

            if (!user) {
                  return res.status(404).json({
                        success: false,
                        message: "404 User Not Found!",
                  });
            }

            await User.findOneAndDelete({ _id: user._id });
            res.status(200).json({
                  success: true,
                  message: `${user?.name}'s data deleted successfully!`,
            });
      } catch (err) {
            console.log(err);

            res.status(500).json({
                  success: false,
                  message: "Internal Server Error",
            });
      }
};

module.exports = deleteUser;

const User = require('../../models/user.model')

// authValidator has already verified the cookie and put the decoded token
// payload on req.user by the time this runs.
const getProfile = async (req, res) => {
      try {
            const user = await User.findById(req.user.userId).select('-password')

            if (!user) {
                  return res.status(404).json({
                        success: false,
                        message: "Account not found!"
                  })
            }
            res.status(200).json({
                  success: true,
                  message: "User found Successfully!",
                  user,
            })
      }
      catch (err) {
            console.log(err)

            res.status(500).json({
                  success: false,
                  message: "Internal Server Error"
            })
      }
};
module.exports = getProfile;

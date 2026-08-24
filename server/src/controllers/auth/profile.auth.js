const jwt = require("jsonwebtoken")
const User = require('../../models/user.model')
const getProfile = async (req, res) => {
      const token = req.cookies?.token;

      if (!token) {
            return res.status(401).json({
                  success: false,
                  message: "Unauthorized",
            });
      }
      try {
            const decoded = await jwt.verify(token, process.env.JWT_KEY)
            const user = await User.findById(decoded.userId).select('-password')

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

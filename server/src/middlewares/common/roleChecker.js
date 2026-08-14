const roleChecker = async (req, res, next) => {
      try {
            const { role } = req.user;
            if (role === "distributor") {
                  next()
            }
            else {
                  return res.status(401).json({
                        success: false,
                        message: "Unauthorized. You are not authorized to perform this action."
                  })
            }
      }
      catch (err) {
            console.log(err)
            return res.status(500).json({
                  success: false,
                  message: "Internal server error."
            })
      }
}

module.exports = roleChecker
const jwt = require("jsonwebtoken");

const authValidator = async (req, res, next) => {
      const token = req.cookies?.token;
      if (!token) {
            return res.status(401).json({
                  success: false,
                  message: "Unauthorized. Please login first."
            })
      }
      try {
            req.user = jwt.verify(token, process.env.JWT_KEY);
            next()
      }
      catch (err) {
            res.status(401).json({
                  success: false,
                  message: "Invalid or expired access token!"
            })
      }
};

module.exports = authValidator;

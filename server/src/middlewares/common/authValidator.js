const jwt = require("jsonwebtoken");

const authValidator = async (req, res, next) => {
      try {
            const token = req.cookies.token
            if (!token) {
                  return res.status(401).json({
                        success: false,
                        message: "Unauthorized. Please login first."
                  })
            }
            const decode = jwt.verify(token, process.env.JWT_KEY);
            if (!decode) {
                  return res.status(401).json({
                        success: false,
                        message: "Invalid or expired access token!"
                  })
            }
            req.user = decode;
            next()
      }
      catch (err) {
            console.log(err)
            res.status(500).json({
                  success: false,
                  message: "Invalid or expired access token!"
            })
      }
};

module.exports = authValidator;
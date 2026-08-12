const logoutAuth = async (req, res) => {
      try {
            res.clearCookie("token", {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "strict",
            });

            res.status(200).json({
                  success: true,
                  message: "Logout Successfully!",
            });
      } catch (err) {
            console.log(err);

            res.status(500).json({
                  success: false,
                  message: "Internal Server Error",
            });
      }
};
module.exports = logoutAuth;

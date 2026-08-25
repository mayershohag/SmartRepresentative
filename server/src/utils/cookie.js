const dotenv = require("dotenv");

dotenv.config();
const isLocalDev = process.env.NODE_ENV === "development";
const TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const cookieOptions = {
      httpOnly: true,
      secure: !isLocalDev,
      sameSite: isLocalDev ? "lax" : "none",
      path: "/",
};

module.exports = { cookieOptions, TOKEN_MAX_AGE_MS };

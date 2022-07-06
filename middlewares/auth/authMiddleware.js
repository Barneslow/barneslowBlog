const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../models/user/user");

const protect = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findById(decoded?.id).select("-password");

        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not authorised, token expired. Log in again");
    }
  } else {
    throw new Error("There is no token attached to the header");
  }
});

module.exports = protect;

const jwt = require("jsonwebtoken");

// auth middleware will be used to verify the token and
// retrieve the user based on the token payload
module.exports = function (req, res, next) {
  const token = req.header("token");
  if (!token)
    return res
      .status(401)
      .json({ message: "No token included in request header" });

  try {
    const decoded = jwt.verify(token, "randomString");
    req.user = decoded.user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Token is invalid or expired" });
  }
};

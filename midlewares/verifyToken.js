const jwt = require("jsonwebtoken");
const appError = require("../utills/appError");
const httpStatusText = require("../utills/httpStatusText");
const verifyToken = (req, res, next) => {
  //  اي مسار محتاج تخليه محمي ومحدش ياكسس عليه الا اذا كان مسجل دخول بتروح للروتس وحط قبلها verifyToken
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!authHeader) {
    const error = appError.create(
      "token is required",
      401,
      httpStatusText.ERROR
    );
    return next(error);
  }
  const token = authHeader.split(" ")[1];
  try {
    const currentUser=jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser=currentUser;
    next();
  } catch (err) {
    const error = appError.create("invalid token", 401, httpStatusText.ERROR);
    return next(error);
  }
};
module.exports = verifyToken;

const appError = require("../utills/appError");

module.exports = (...roles) => {
  console.log("roles", roles);
  return (req, res, next) => {
if(!roles.includes(req.currentUser.role)){
    return next(appError.create('this role is not allowd to do that',401))
}
      next();
  };
};

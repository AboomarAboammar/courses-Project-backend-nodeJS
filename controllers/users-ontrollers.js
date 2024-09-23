
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utills/generateJWT");
const httpStatusText = require("../utills/httpStatusText");
const asyncWrapper = require("../midlewares/asyncWrapper");
const appError = require("../utills/appError");
const User = require("../models/UserModel");
const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;

  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { users: users } });
});

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    const error = appError.create(
      "user already exist",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  // do hashing for password bcryptjs

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename
  });

  // genrate jwt token     this order to generat a random secret key   ---->   require('crypto').randomBytes(32).toString('hex')
  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  console.log(token);
  newUser.token = token;
  await newUser.save();
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && password) {
    const error = appError.create(
      "email and password are required",
      400,
      httpStatusText.ERROR
    );
    return next(error);
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = appError.create("user not found", 404, httpStatusText.FAIL);
    return next(error);
  }
  const matchedPassword = await bcrypt.compare(password, user.password);

  if (user && matchedPassword) {
    //logged in successfuly
    const token = await generateJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    });
    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { token },
    });
  } else {
    const error = appError.create(
      "email or password not matched",
      400,
      httpStatusText.ERROR
    );
    return next(error);
  }
});
module.exports = {
  getAllUsers,
  register,
  login,
};

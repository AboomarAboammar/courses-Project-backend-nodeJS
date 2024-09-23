const mongoose = require("mongoose");
const validator = require("validator");
const userRols = require("../utills/userRols");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "must be an avalid email"],
    // use validatorJs liberary  npm install validator
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: [userRols.ADMIN, userRols.MANEGER, userRols.USER],
    default: userRols.USER,
  },
  avatar: {
    type: String,
    default: "uploads/profile.png",
  },
});

module.exports = mongoose.model("User", UserSchema);

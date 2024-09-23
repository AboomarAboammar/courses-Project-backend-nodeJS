const express = require("express");
const verifyToken = require("../midlewares/verifyToken.js");
// for image and file
const multer = require("multer");
const diskStorage = multer.diskStorage({
  destination: function (req, file, callBack) {
    console.log("file", file);
    callBack(null, "uploads");
  },
  filename: function (req, file, callBack) {
    const ext = file.mimetype.split('/')[1];
    const filename = `user-${Date.now()}.${ext}`;
    callBack(null, filename);
  },
});
const fileFilter = (req,file,callBack)=>{
    const imageType = file.mimetype.split('/')[0];

    if(imageType === 'image'){
        return callBack(null,true)
    }else{
        return callBack(appError.create('file must be an image',400) ,false)
    }
}

const upload = multer({ storage: diskStorage,fileFilter:fileFilter });
const router = express.Router();
const userControllers = require("../controllers/users-ontrollers.js");
const appError = require("../utills/appError.js");
// get all    >>  register >>>  login  >>
router.route("/").get(verifyToken, userControllers.getAllUsers);

router
  .route("/register")
  .post(upload.single("avatar"), userControllers.register);

router.route("/login").post(userControllers.login);

module.exports = router;

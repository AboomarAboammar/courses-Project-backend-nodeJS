/*


const express = require("express");
const courseControllers = require("../controllers/courses-controlers.js");

const router = express.Router();
// نستخدم ال router بدلاً من ال app
const { body, validationResult } = require("express-validator");

// استيراد الدورات من ملف البيانات
let courses = require("../data/courses.js"); // تأكد من صحة المسار

// GET ALL - الحصول على كل الدورات
router.get("/", courseControllers.GetAllCources);

// الحصول على دورة واحدة حسب الـ ID
router.get("/:courseId", courseControllers.GetOneCource);

// إنشاء دورة جديدة
router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title is required").isLength({ min: 2 }).withMessage("Title must be at least 2 characters"),
    body("price").notEmpty().withMessage("Price is required"),
  ],
  courseControllers.CreateCources
);

// تحديث دورة بواسطة PATCH
router.patch("/:courseId", courseControllers.UpdateCource);

// حذف دورة
router.delete("/:courseId", courseControllers.DeleteCource);

module.exports = router;

*/

// ممكن نضبط الكود عن طريق ان اللي الروت بتاعه واحد نجمعهم مع بعض كالاتي

const express = require("express");
const router = express.Router();

const courseControllers = require("../controllers/courses-controlers.js");
const validationMiddleWare = require("../midlewares/validation-middleware.js");
const verifyToken = require("../midlewares/verifyToken");
const allowedTo = require("../midlewares/allowedTo.js");
const userRols = require("../utills/userRols.js");

// نستخدم ال router بدلاً من ال app
//const { body, validationResult } = require("express-validator");

// GET ALL - الحصول على كل الدورات
router.route("/").get(courseControllers.GetAllCources).post(
  verifyToken,
    allowedTo(userRols.ADMIN, userRols.MANEGER),
  validationMiddleWare(),
  /* وممكن ناخد الbody في ملف خارجي نسميه مثلا midleware validation
    [
      body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 2 })
        .withMessage("Title must be at least 2 characters"),
      body("price").notEmpty().withMessage("Price is required"),
    ],
  */
  courseControllers.CreateCources
);
//
router
  .route("/:courseId")
  .patch(validationMiddleWare(),  verifyToken,
  allowedTo(userRols.ADMIN, userRols.MANEGER), courseControllers.UpdateCource) // تحديث دورة بواسطة PATCH
  .delete(
    verifyToken,
    allowedTo(userRols.ADMIN, userRols.MANEGER),
    courseControllers.DeleteCource
  ) // الحذف
  .get(courseControllers.GetOneCource); // الحصول على دورة واحدة حسب الـ ID

// حذف دورة

module.exports = router;


const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const httpStatusText=require("../utills/httpStatusText")
const asyncWrapper = require("../midlewares/asyncWrapper");
const Course = require("../models/coursesSchema");
const appError = require("../utills/appError");
const GetAllCources = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;

  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  res.json({ status:httpStatusText.SUCCESS, data: { courses: courses } });
});
const GetOneCource = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;

  // التحقق من صحة الـ ObjectId
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return next(appError.create("Invalid Course ID", 400, httpStatusText.FAIL));
  }
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    const error = appError.create("Course not found", 404, httpStatusText.FAIL);
    return next(error);

    
  }
  return res.status(200).json({ status: httpStatusText.SUCCESS, data: { course: course } });

  /*
  قبل استخدام الميدل وير
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
     return res.status(404).json({ status: "faile", data: { course: null } });
    }
    return res.status(200).json({ status: "success", data: { course: course } });
  } catch (err) {
    return res
      .status(400)
      .json({ status: "error", data: null, message: err.message });
  }
  */
});

const UpdateCource = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;
  const errors = validationResult(req);

  // التحقق من صحة الـ ObjectId
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return next(appError.create("Invalid Course ID", 400, httpStatusText.FAIL));
  }

  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);

    return next(error);
  
  }
  const updatedCourse = await Course.updateOne(
    { _id: courseId },
    {
      $set: { ...req.body },
    }
  );
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { course: updatedCourse } });
  /*
 befor use middle ware
  const courseId = req.params.courseId;

  try {
    const updatedCourse = await Course.updateOne(
      { _id: courseId },
      {
        $set: { ...req.body },
      }
    );
    return res
      .status(200)
      .json({ status: "updated success", data: { course: updatedCourse } });
  } catch (err) {
    return res
      .status(400)
      .json({ status: "erorr", data: null, massege: err.massege });
  }
 
 
 */
});
const DeleteCource = asyncWrapper(async (req, res, next) => {
 
  if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
    return next(appError.create("Invalid Course ID", 400, httpStatusText.FAIL));
  }
  await Course.deleteOne({ _id: req.params.courseId });

  res.status(200).json({ success: httpStatusText.SUCCESS, data: null });
});
const CreateCources = asyncWrapper(async (req, res, next) => {
  
  const errors = validationResult(req);


  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);

    return next(error);
    // return res.status(400).json({ status: "faile", data: erorrs.array() });
  }

  // عاوزين نحل مشكلة ان لوضيفنا كورس من غير تايتل او سعر لا يتم اضافته
  /*  
if (!req.body.title || !req.body.price) {
      return res.status(400).json({ msg: "title and price is required" });
    } 
*/
  // احنا هنا بنعمل شرط ولكن ممكن يكون عندنا حاجات كتير جدا بنعمل شروط عليها فكدة الكود هيكبر مننا وهنا جه دور مكتبة اسمها express validator ودي بنعمل validation  من خلالها

  // npm i express-validator  هي من خلاها نقدر نعرف الابلكيشن ان السعر مطلوب والتايتل وعدد الاحرف وحاجات تانية موجودة في ال dox

  // بعد اتاكدنا ان الريكويست بودي تم بشكل صحيح نعمله push in the courses
  // const coursCreated = { id: courses.length + 1, ...req.body };
  //courses.push(coursCreated);
  // res.json(req.body);  دة للاختبار ان الكورس اتضاف من علي بوست مان او الفرونت
  const newCourse = new Course(req.body);
  await newCourse.save();
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
});
module.exports = {
  GetAllCources,
  GetOneCource,
  DeleteCource,
  UpdateCource,
  CreateCources,
};

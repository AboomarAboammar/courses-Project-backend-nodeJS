const express = require("express");
const path = require("path");
const cors = require("cors");
const httpStatusText = require("./utills/httpStatusText");
const app = express();
app.use('/uploads',express.static(path.join(__dirname,"uploads")))
require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGO_URL;
//npm install --save multer  for uploads file and form data
mongoose.connect(url).then(() => {
  console.log("connected to mongoose");
});
app.use(cors());
app.use(express.json()); //midleware
const usersRouter = require("./Routes/usersRouts");

const courcesRouter = require("./Routes/cources.routes");
app.use("/api/courses", courcesRouter);
app.use("/api/users", usersRouter);
//global middelware for handle erorr wrong rout
app.all("*", (req, res, next) => {
  return res.status(404).json({
    status: httpStatusText.ERROR,
    data: null,
    massege: "this resource is not available",
  });
});
//global middle ware for handling wrongs

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || "Something went wrong!",
    message: error.message || "Something went wrong!",
    code: error.statusCode || 500,
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("listening on port 4000");
});
// ملحوظة لو عملنا مشروع فرونت وحبينا نكلم الروت دي هتكون مقفولة لانه لازم نعما سطب لل CORSحتي لو شغالة علي بوست مان او لوكال هوست

// CORS بنشغلها قبل الروتس كميدل وير وكمان نقدر نشغلها علي روت واحد بعينه

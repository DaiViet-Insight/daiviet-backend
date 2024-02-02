const express = require("express");
const router = express.Router();
const lectureController = require("../controllers/lectureController");
const { hasPermission } = require("../middleware/rbac.middleware");


// get detail 
//
router.get("/",lectureController.getLectures);
router.get("/:id", lectureController.getLectureById);
router.post("/", lectureController.createLecture);



module.exports = router;

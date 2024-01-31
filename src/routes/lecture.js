const express = require("express");
const router = express.Router();
const lectureController = require("../controllers/lectureController");




// get detail 

router.get("/:id", lectureController.getLectureById);
router.post("/", lectureController.createLecture);
router.get("/", lectureController.getLectures);


module.exports = router;

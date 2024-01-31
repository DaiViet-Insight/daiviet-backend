const express = require("express");
const router = express.Router();
const lectureController = require("../controllers/lectureController");



//get all 

router.get("/", lectureController.getLectures);

// get detail 


router.get("/:id", lectureController.getLectureById);

//
router.post("/", lectureController.createLecture);


module.exports = router;

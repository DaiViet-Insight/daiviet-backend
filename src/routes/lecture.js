const express = require("express");
const router = express.Router();
const lectureController = require("../controllers/lectureController");

router.get("/:id", lectureController.getLectureById);
router.get("/", lectureController.getLectureByEventId);

module.exports = router;

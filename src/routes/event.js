const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.post("/:eventId/follow", eventController.followEvent);
router.get("/", eventController.getAllEvent);

module.exports = router;

// commentRoutes.js
const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.post("/:id/downvote", commentController.downvoteComment);
router.post("/:id/upvote", commentController.upvoteComment);
router.post("/create", commentController.createComment);
router.get("/", commentController.getAllCommentByPostId);

module.exports = router;

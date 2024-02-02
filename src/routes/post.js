// postRoutes.js
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const commentRoutes = require("./comment");

// Middleware để truyền giá trị postId từ postRoutes sang commentRoutes
router.param("postId", (req, res, next, postId) => {
    req.postId = postId;
    next();
});

router.get("/saves", postController.getSavePost);
router.get("/upvotes", postController.getUpvotePost);
router.get("/downvotes", postController.getDownvotePost);
router.get("/unapproved", postController.getUnapprovedPost);
router.post("/:postId/accept", postController.acceptPost);
router.post("/:postId/reject", postController.rejectPost);
router.post("/:postId/save", postController.savePost);
router.post("/:postId/upvote", postController.upvotePost);
router.post("/:postId/downvote", postController.downvotePost);
router.use("/:postId/comments", commentRoutes);
router.get("/:postId", postController.getDetailPost);
router.post("/:create", postController.createPost);
router.get("/", postController.getInfoPost);

module.exports = router;

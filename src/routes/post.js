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

router.post("/:postId/save", postController.savePost);
router.post("/:postId/upvote", postController.upvotePost);
router.post("/:postId/downvote", postController.downvotePost);
router.use("/:postId/comments", commentRoutes);
router.post("/:create", postController.createPost);
router.get("/", postController.getInfoPost);

module.exports = router;

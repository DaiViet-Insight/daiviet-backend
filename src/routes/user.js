const express = require("express");
const router = express.Router();
const postRoutes = require("./post");
const userController = require("../controllers/userController");

router.param("userId", (req, res, next, userId) => {
    req.userId = userId;
    next();
});

router.use("/:userId/posts", postRoutes);
router.get("/:userId/follows", userController.getEventsByUserId);
router.get("/follows", userController.getEventsByUserId);
router.use("/posts", postRoutes);
router.post("/register", userController.register);
router.post("/login", userController.login);

module.exports = router;

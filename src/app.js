require("dotenv").config();
const express = require("express");
const app = express();
const userMiddleware = require("./middleware/user.middleware");
const path = require('path');
const multer = require('multer');
const session = require("express-session");
const morgan = require("morgan");
app.use(morgan("dev"));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const router = express.Router();
const file = require('./routes/file.js');
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");
const commentRoutes = require("./routes/comment");
const eventRoutes = require("./routes/event");
const lectureRoutes = require("./routes/lecture");
const notificationRoutes = require("./routes/notification");

// CORS error handling
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // '*' for all
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method == "OPTIONS") {
        res.header(
            "Access-Control-Allow-Methods",
            "PUT, POST, PATCH, DELETE, GET"
        ); // '*' for all
        return res.status(200).json({});
    }
    next();
});

app.use('/file', file);

// Session
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 60000 },
    })
);

app.use("/api", router);
app.use("/api/users", userRoutes);
app.use("/api/posts", userMiddleware.Validate, postRoutes);
app.use("/api/comments", userMiddleware.Validate, commentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/notifications", userMiddleware.Validate, notificationRoutes);

router.get("/", (req, res, next) => {
    res.send("Server is running ...");
});

module.exports = app;

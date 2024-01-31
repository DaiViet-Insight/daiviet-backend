const PostService = require("../services/postService");
const PostVoteService = require("../services/post_vote_Service");
const PostSaveService = require("../services/post_save_Service");
const CommentService = require("../services/commentService");
const jwtService = require("../services/jwtService");

module.exports = {
    getInfoPost: async (req, res) => {
        const status = req.query.status;
        const type = req.query.type;
        const postId = req.query.afterPost;
        const limit = parseInt(req.query.size);
        const eventId = req.query.eventId;
        let userId = req.userId;
        if (!userId) {
            const token = req.headers.authorization.substring(7);
            userId = jwtService.decodeToken(token).id;
        }
        try {
            let posts;
            if (type === "new") {
                posts = await PostService.getNewPost(
                    limit,
                    postId,
                    eventId,
                    userId
                );
            } else if (type === "hot") {
                posts = await CommentService.getPostsSort(
                    limit,
                    postId,
                    eventId,
                    userId
                );
            } else if (type === "top") {
                posts = await PostVoteService.getPostsHot(
                    limit,
                    postId,
                    eventId,
                    userId
                );
            } else if (status === "upvoted") {
                posts = await PostVoteService.getPostsByUserId(userId, 1);
            } else if (status === "downvoted") {
                posts = await PostVoteService.getPostsByUserId(userId, 2);
            } else if (status === "saved") {
                posts = await PostSaveService.getPostsByUserId(userId);
            }

            res.send(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    createPost: async (req, res) => {
        try {
            const data = req.body;
            const token = req.headers.authorization.substring(7);
            await PostService.createPost(
                data.title,
                data.content,
                data.eventIds,
                jwtService.decodeToken(token).id
            );
            res.send("Tạo bài viết thành công !!!");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAllComments: async (req, res) => {
        try {
            const data = await PostService.getAllComments();
            res.send(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    upvotePost: async (req, res) => {
        try {
            const postId = req.params.postId;
            await PostVoteService.create(
                jwtService.decodeToken(req.headers.authorization.substring(7))
                    .id,
                postId,
                1
            );
            res.send("Upvote post thành công !!!");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    downvotePost: async (req, res) => {
        try {
            const postId = req.params.postId;
            await PostVoteService.create(
                jwtService.decodeToken(req.headers.authorization.substring(7))
                    .id,
                postId,
                2
            );
            res.send("Downvote post thành công !!!");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    savePost: async (req, res) => {
        try {
            const postId = req.params.postId;
            const result = await PostSaveService.create(
                postId,
                jwtService.decodeToken(req.headers.authorization.substring(7))
                    .id
            );
            if (result === null) {
                res.send("Xóa bài viết thành công !!!");
            } else res.send("Lưu bài viết thành công !!!");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getDetailPost: async (req, res) => {
        try {
            const postId = req.params.postId;
            const post = await PostService.getDetailPost(
                postId,
                jwtService.decodeToken(req.headers.authorization.substring(7))
                    .id
            );
            res.send(post);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

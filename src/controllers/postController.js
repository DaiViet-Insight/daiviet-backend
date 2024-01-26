const PostService = require("../services/postService");
const PostVoteService = require("../services/post_vote_Service");
const CommentService = require("../services/commentService");
const jwtService = require("../services/jwtService");

module.exports = {
    getInfoPost: async (req, res) => {
        const status = req.query.status;
        const type = req.query.type;
        const postId = req.query.afterPost;
        const limit = parseInt(req.query.size);
        const userId = req.userId;
        try {
            if (type === "new") {
                const posts = await PostService.getNewPost(limit, postId);
                res.send(posts);
            } else if (type === "hot") {
                const posts = await CommentService.getPostsSort(limit, postId);
                res.send(posts);
            } else if (type === "top") {
                const posts = await PostVoteService.getPostsHot(limit, postId);
                res.send(posts);
            } else if (status === "upvoted") {
                const posts = await PostVoteService.getPostsByUserId(userId, 1);
                res.send(posts);
            } else if (status === "downvoted") {
                const posts = await PostVoteService.getPostsByUserId(userId, 2);
                res.send(posts);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    createPost: async (req, res) => {
        try {
            const data = req.body;
            await PostService.createPost(
                data.title,
                data.content,
                data.eventIds,
                jwtService.decodeToken(req.session.token).id
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
                jwtService.decodeToken(req.session.token).id,
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
                jwtService.decodeToken(req.session.token).id,
                postId,
                2
            );
            res.send("Downvote post thành công !!!");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

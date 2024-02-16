const CommentService = require("../services/commentService");
const CommentVoteService = require("../services/comment_vote_Service");
const jwtService = require("../services/jwtService");

module.exports = {
    getAllCommentByPostId: async (req, res) => {
        try {
            const comments = await CommentService.getAllCommentByPostId(
                req.postId,
                jwtService.decodeToken(req.headers.authorization.substring(7))
                    .id
            );
            res.send(comments);
        } catch (error) {
            res.status(500).json({ error1: error.message });
        }
    },
    createComment: async (req, res) => {
        try {
            const postId = req.postId;
            const data = req.body;
            const comment = await CommentService.createComment(
                postId,
                data.content,
                data.rootCommentId,
                jwtService.decodeToken(req.headers.authorization.substring(7))
                    .id
            );
            res.send(comment);
        } catch (error) {
            res.status(500).json({ error2: error.message });
        }
    },
    upvoteComment: async (req, res) => {
        try {
            const commentId = req.params.id;
            await CommentVoteService.create(
                jwtService.decodeToken(req.headers.authorization.substring(7))
                    .id,
                commentId,
                1
            );
            res.send("Upvote comment thành công !!!");
        } catch (error) {
            res.status(500).json({ error3: error.message });
        }
    },
    downvoteComment: async (req, res) => {
        try {
            const commentId = req.params.id;
            await CommentVoteService.create(
                jwtService.decodeToken(req.headers.authorization.substring(7))
                    .id,
                commentId,
                2
            );
            res.send("DownVote comment thành công !!!");
        } catch (error) {
            res.status(500).json({ error3: error.message });
        }
    },
};

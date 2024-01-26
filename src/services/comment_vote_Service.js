const { CommentVote } = require("../models");

module.exports = {
    create: async (userId, commentId, value) => {
        try {
            const commentVote = await CommentVote.create({
                userId: userId,
                commentId: commentId,
                voteTypeId: value,
            });
            return commentVote;
        } catch (error) {
            throw new Error(`Error creating comment vote: ${error.message}`);
        }
    },
};

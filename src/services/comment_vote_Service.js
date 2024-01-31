const { CommentVote } = require("../models");

module.exports = {
    create: async (userId, commentId, value) => {
        try {
            const isExist = await CommentVote.findOne({
                where: {
                    userId: userId,
                    commentId: commentId,
                },
            });
            if (isExist) {
                if (isExist.voteTypeId === value) {
                    await CommentVote.destroy({
                        where: {
                            userId: userId,
                            commentId: commentId,
                        },
                    });
                    return null;
                } else {
                    await CommentVote.update(
                        {
                            voteTypeId: value,
                        },
                        {
                            where: {
                                userId: userId,
                                commentId: commentId,
                            },
                        }
                    );
                    return null;
                }
            }

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

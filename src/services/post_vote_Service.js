const { PostVote } = require("../models");
const postService = require("./postService");
const Sequelize = require("sequelize");

module.exports = {
    create: async (userId, postId, value) => {
        try {
            const isExist = await PostVote.findOne({
                where: {
                    userId: userId,
                    postId: postId,
                },
            });
            if (isExist) {
                if (isExist.voteTypeId === value) {
                    await PostVote.destroy({
                        where: {
                            userId: userId,
                            postId: postId,
                        },
                    });
                    return null;
                } else {
                    await PostVote.update(
                        {
                            voteTypeId: value,
                        },
                        {
                            where: {
                                userId: userId,
                                postId: postId,
                            },
                        }
                    );
                    return null;
                }
            }
            const postVote = await PostVote.create({
                userId: userId,
                postId: postId,
                voteTypeId: value,
            });
            return postVote;
        } catch (error) {
            throw new Error(`Error creating post vote: ${error.message}`);
        }
    },
    getPostsByUserId: async (userId, value) => {
        try {
            const postIds = await PostVote.findAll({
                where: {
                    userId: userId,
                    voteTypeId: value,
                },
                attributes: ["postId"],
            });
            const postIdArray = postIds.map((postVote) => postVote.postId);
            const posts = await postService.getAllPostByIds(postIdArray);
            return posts;
        } catch (error) {
            throw new Error(
                `Error fetching posts by user ID: ${error.message}`
            );
        }
    },
    getPostsHot: async (size, postId) => {
        try {
            const postIds = await PostVote.findAll({
                attributes: [
                    "postId",
                    [
                        Sequelize.literal(
                            "(SUM(CASE WHEN voteTypeId = 1 THEN 1 ELSE 0 END) - SUM(CASE WHEN voteTypeId = 2 THEN 1 ELSE 0 END))"
                        ),
                        "vote_difference",
                    ],
                ],
                group: ["postId"],
                limit: size,
                order: [[Sequelize.literal("vote_difference"), "DESC"]],
            });
            if (postId) {
                const index = postIds.findIndex(
                    (post) => post.postId === postId
                );
                if (index != -1) {
                    const selectedIds = postIds
                        .slice(index + 1, index + 1 + size)
                        .map((post) => post.postId);
                    const posts = await postService.getAllPostByIds(
                        selectedIds
                    );
                    return posts;
                }
            } else {
                const selectedIds = postIds.map((post) => post.postId);
                const posts = await postService.getAllPostByIds(selectedIds);
                return posts;
            }
        } catch (error) {
            throw new Error(
                `Error fetching posts by user ID: ${error.message}`
            );
        }
    },
};

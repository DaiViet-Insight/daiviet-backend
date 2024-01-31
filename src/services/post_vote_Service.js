const { PostVote } = require("../models");
const postService = require("./postService");
const Sequelize = require("sequelize");
const eventService = require("./eventService");
const post_eventService = require("./post_event_Service");

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
            if(postIdArray.length === 0) return [];
            const posts = await postService.getAllPostByIds(postIdArray);
            return posts;
        } catch (error) {
            throw new Error(
                `Error fetching posts by user ID: ${error.message}`
            );
        }
    },
    getPostsHot: async (size, postId, eventId) => {
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

            let selectedIds = postIds.map((post) => post.postId);

            if (postId) {
                const index = postIds.findIndex(
                    (post) => post.postId === postId
                );
                if (index !== -1) {
                    selectedIds = postIds
                        .slice(index + 1, index + 1 + size)
                        .map((post) => post.postId);
                    if (selectedIds.length === 0) return [];
                }
            }
            if (eventId) {
                const event = await eventService.getEventById(eventId);

                if (!event) {
                    throw new Error("Sự kiện không tồn tại");
                }

                const postIdsByEventId =
                    await post_eventService.getPostIdsByEventId(eventId);

                // Lọc ra các postId từ postIds có trong postIdsByEventId
                selectedIds = postIds
                    .filter((post) => postIdsByEventId.includes(post.postId))
                    .map((post) => post.postId);
            }
            const posts = await postService.getAllPostByIds(selectedIds);
            return posts;
        } catch (error) {
            throw new Error(
                `Error fetching posts by user ID: ${error.message}`
            );
        }
    },
};

const { Comment } = require("../models");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const postService = require("./postService");
const eventService = require("./eventService");
const post_eventService = require("./post_event_Service");

module.exports = {
    getAllCommentByPostId: async (postId) => {
        try {
            const comments = await Comment.findAll({
                where: {
                    postId: postId,
                },
            });
            return comments;
        } catch (error) {
            throw new Error(
                `Error fetching comments by post ID: ${error.message}`
            );
        }
    },
    getCommentById: async (commentId) => {
        try {
            const comment = await Comment.findByPk(commentId);
            return comment;
        } catch (error) {
            throw new Error(`Error fetching comment by ID: ${error.message}`);
        }
    },
    createComment: async (postId, content, rootCommentId, postedBy) => {
        try {
            // Kiểm tra xem rootCommentId đã tồn tại trong cơ sở dữ liệu hay chưa
            const existingRootComment = await Comment.findByPk(rootCommentId);

            const comment = await Comment.create({
                postId: postId,
                content: content,
                rootCommentId: existingRootComment ? rootCommentId : null,
                postedBy: postedBy,
            });
            return comment;
        } catch (error) {
            throw new Error(`Error creating comment: ${error.message}`);
        }
    },
    getPostsSort: async (limit, postId, eventId) => {
        try {
            let queryOptions = {
                attributes: [
                    "postId",
                    [
                        Sequelize.fn("COUNT", Sequelize.col("id")),
                        "commentCount",
                    ],
                ],
                group: ["postId"],
                limit: limit,
                order: [[Sequelize.literal("commentCount"), "DESC"]],
            };

            const conditions = [];

            if (postId) {
                const afterPostCommentCount = await Comment.count({
                    where: { postId: postId },
                });

                conditions.push({
                    [Op.not]: postId,
                });

                queryOptions.having = Sequelize.literal(
                    `commentCount < ${afterPostCommentCount}`
                );
            }

            if (eventId) {
                const event = await eventService.getEventById(eventId);

                if (!event) {
                    throw new Error("Sự kiện không tồn tại");
                }

                const postIds = await post_eventService.getPostIdsByEventId(
                    eventId
                );

                conditions.push({
                    [Op.in]: postIds,
                });
            }

            if (conditions.length > 0) {
                queryOptions.where = {
                    [Op.and]: conditions,
                };
            }

            const postIds = await Comment.findAll(queryOptions);

            let postIdArray = postIds.map((comment) => comment.postId);
            const otherPostIds = await postService.getOtherPostIds(postIdArray);
            postIdArray = postIdArray.concat(otherPostIds);
            if (postIdArray.length === 0) return [];
            // Lấy danh sách bài viết theo postIdArray
            const posts = await postService.getAllPostByIds(postIdArray);

            return posts;
        } catch (error) {
            throw new Error(`Lỗi khi lấy bài viết mới nhất: ${error.message}`);
        }
    },
};

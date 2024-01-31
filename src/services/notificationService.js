const { NotificationComment } = require("../models");
const { NotificationPost } = require("../models");
const Sequelize = require("sequelize");

module.exports = {
    getAllNotification: async (size, postedBy) => {
        try {
            const postQuery = {
                attributes: [
                    "id",
                    ["postId", "post_id"],
                    "title",
                    [Sequelize.literal("NULL"), "comment_id"],
                    ["createdAt", "createdAt"],
                ],
            };

            const commentQuery = {
                attributes: [
                    "id",
                    [Sequelize.literal("NULL"), "post_id"],
                    "title",
                    "commentId",
                    "createdAt",
                ],
            };

            if (postedBy) {
                postQuery.where = { postedBy: postedBy };
                commentQuery.where = { postedBy: postedBy };
            }

            const posts = await NotificationPost.findAll(postQuery);
            const comments = await NotificationComment.findAll(commentQuery);

            const results = posts
                .concat(comments)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            if (size) {
                return results.slice(0, size);
            }

            const notifications = results.map((result) => result.toJSON()); // Chuyển đổi thành dạng JSON
            return notifications;
        } catch (error) {
            throw new Error(`Error getting notifications: ${error.message}`);
        }
    },
};

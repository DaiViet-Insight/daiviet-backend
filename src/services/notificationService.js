const { NotificationComment, Comment } = require("../models");
const { NotificationPost, PostSave } = require("../models");
const Sequelize = require("sequelize");

module.exports = {
    getAllNotification: async (size, currentUserId) => {
        try {
            // Bước 1: Lấy ra danh sách các postId mà currentUserId đã lưu
            const savedPosts = await PostSave.findAll({
                where: {
                    userId: currentUserId,
                },
                attributes: ["postId"],
            });

            const savedPostIds = savedPosts.map((post) => post.postId);

            // Bước 2: Lấy ra các thông báo từ bảng NotificationPost và NotificationComment dựa trên savedPostIds
            const posts = await NotificationPost.findAll({
                where: {
                    postId: savedPostIds,
                },
                attributes: [
                    "id",
                    ["postId", "post_id"],
                    "title",
                    [Sequelize.literal("NULL"), "comment_id"],
                    ["createdAt", "createdAt"],
                ],
            });

            const comments = await NotificationComment.findAll({
                attributes: [
                    "id",
                    [Sequelize.literal("NULL"), "post_id"],
                    "title",
                    "commentId",
                    "createdAt",
                ],
                include: {
                    model: Comment,
                    required: true,
                    attributes: [],
                    where: {
                        postId: savedPostIds,
                    },
                },
            });

            // Bước 3: Tổ chức và sắp xếp các thông báo theo thời gian tạo
            const results = posts
                .concat(comments)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // Trả về kết quả theo kích thước mong muốn (nếu có)
            if (size) {
                return results.slice(0, size);
            }

            // Chuyển đổi kết quả thành JSON và trả về
            const notifications = results.map((result) => result.toJSON());
            return notifications;
        } catch (error) {
            throw new Error(`Error getting notifications: ${error.message}`);
        }
    },
};

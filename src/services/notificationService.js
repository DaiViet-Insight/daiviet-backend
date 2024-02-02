const { NotificationComment, Comment } = require("../models");
const { NotificationPost, PostSave, Post } = require("../models");
const { User } = require("../models");
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
                    "postId",
                    "title",
                    "content",
                    [Sequelize.literal("NULL"), "commentId"],
                    ["createdAt", "createdAt"],
                ],
            });

            const comments = await NotificationComment.findAll({
                attributes: [
                    "id",
                    [Sequelize.literal("NULL"), "postId"],
                    "title",
                    "content",
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

            // Bước 4: Lấy thông tin người dùng từ postId hoặc commentId
            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                if (result.postId) {
                    const user = await Post.findOne({
                        where: {
                            id: result.postId,
                        },
                        attributes: [],
                        include: {
                            model: User,
                            required: true,
                            attributes: ["id", "fullname", "avatar"],
                        },
                    });
                    result.dataValues.User = {
                        id: user.User.id,
                        fullname: user.User.fullname,
                        avatar: user.User.avatar,
                    };
                } else if (result.commentId) {
                    const user = await Comment.findOne({
                        where: {
                            id: result.commentId,
                        },
                        attributes: [],
                        include: {
                            model: User,
                            required: true,
                            attributes: ["id", "fullname", "avatar"],
                        },
                    });
                    result.dataValues.User = {
                        id: user.User.id,
                        fullname: user.User.fullname,
                        avatar: user.User.avatar,
                    };
                }
            }

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

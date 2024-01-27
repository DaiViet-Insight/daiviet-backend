const { Sequelize } = require("sequelize");
const { Post } = require("../models");
const eventService = require("./eventService");
const post_eventService = require("./post_event_Service");

module.exports = {
    getNewPost: async (limit, postId, eventId) => {
        try {
            let queryOptions = {
                limit: limit,
                order: [["createdAt", "DESC"]],
                where: {},
            };
            if (postId) {
                const post = await Post.findByPk(postId);

                if (!post) {
                    throw new Error("Bài viết không tồn tại");
                }

                queryOptions.where.createdAt = {
                    [Sequelize.Op.gt]: post.createdAt,
                };
            }

            if (eventId) {
                const event = await eventService.getEventById(eventId);

                if (!event) {
                    throw new Error("Sự kiện không tồn tại");
                }

                const postIds = await post_eventService.getPostIdsByEventId(
                    eventId
                );

                queryOptions.where.id = postIds;
            }

            // Tìm x bài viết mới nhất sau bài viết tham chiếu theo createDate
            const latestPosts = await Post.findAll(queryOptions);

            return latestPosts;
        } catch (error) {
            throw new Error(`Lỗi khi lấy bài viết mới nhất: ${error.message}`);
        }
    },
    createPost: async (title, content, eventIds, postedBy) => {
        try {
            const events = await eventService.getAllEventByIds(eventIds); //Lấy danh sách sự kiện trong
            if (eventIds.length !== events.length) {
                // Kiểm tra xem số lượng sự kiện trong danh sách có bằng số lượng sự kiện trong database không
                throw new Error("Sự kiện không tồn tại");
            }

            // Tạo bài viết
            const post = await Post.create({
                title: title,
                content: content,
                postedBy: postedBy,
            });

            // // Tạo bài viết sự kiện
            for (let i = 0; i < events.length; i++) {
                await post_eventService.createPostEvent(post.id, events[i].id);
            }

            return post;
        } catch (error) {
            throw new Error(`Lỗi khi tạo bài viết: ${error.message}`);
        }
    },
    getAllComments: async () => {
        try {
            const comments = await Post.findAll({
                where: {
                    content: { [Sequelize.Op.like]: "%comment%" },
                },
            });
            return comments;
        } catch (error) {
            throw new Error(`Lỗi khi lấy bình luận: ${error.message}`);
        }
    },
    getAllPostByIds: async (postIds) => {
        try {
            const posts = await Post.findAll({
                where: {
                    id: postIds,
                },
                order: [
                    [
                        Sequelize.literal(
                            `FIELD(id, ${postIds
                                .map((id) => `'${id}'`)
                                .join(",")})`
                        ),
                    ],
                ],
            });
            return posts;
        } catch (error) {
            throw new Error(`Lỗi khi lấy bài viết: ${error.message}`);
        }
    },
};

const { Comment, User, CommentVote } = require("../models");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const postService = require("./postService");
const eventService = require("./eventService");
const post_eventService = require("./post_event_Service");
const userService = require("./userService");

module.exports = {
    getAllCommentByPostId: async (postId, currentUserID) => {
        try {
            const comments = await Comment.findAll({
                where: {
                    postId: postId,
                },
                include: [
                    {
                        model: User,
                        attributes: ["id", "fullname", "avatar"],
                    },
                ],
            });

            // Lấy số lượng upvote, downvote và tính toán tổng số vote cho mỗi comment
            for (let comment of comments) {
                const upvotes = await CommentVote.count({
                    where: {
                        commentId: comment.id,
                        voteTypeId: 1, // upvote
                    },
                });

                const downvotes = await CommentVote.count({
                    where: {
                        commentId: comment.id,
                        voteTypeId: 2, // downvote
                    },
                });

                // Tính tổng số vote bằng cách trừ số lượng downvote từ số lượng upvote
                const totalVotes = upvotes - downvotes;

                // Thêm thông tin về số upvote, downvote và tổng số vote vào mỗi comment
                comment.dataValues.upvotesCount = upvotes;
                comment.dataValues.downvotesCount = downvotes;
                comment.dataValues.voteCount = totalVotes;

                // Kiểm tra xem người dùng hiện tại đã upvote/downvote comment này chưa
                const currentUserUpvoted = await CommentVote.findOne({
                    where: {
                        commentId: comment.id,
                        userId: currentUserID,
                        voteTypeId: 1, // upvote
                    },
                });

                const currentUserDownvoted = await CommentVote.findOne({
                    where: {
                        commentId: comment.id,
                        userId: currentUserID,
                        voteTypeId: 2, // downvote
                    },
                });

                // Thêm thông tin về việc người dùng hiện tại đã upvote/downvote comment này hay chưa
                comment.dataValues.currentUserUpvoted = !!currentUserUpvoted;
                comment.dataValues.currentUserDownvoted =
                    !!currentUserDownvoted;
            }

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

                queryOptions.having = Sequelize.literal(
                    `commentCount < ${afterPostCommentCount}`
                );

                conditions.push({
                    postId: { [Op.not]: postId },
                });
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
                    postId: { [Op.in]: postIds },
                });
            }

            if (conditions.length > 0) {
                queryOptions.where = {
                    [Op.and]: conditions,
                };
            }

            const postIds = await Comment.findAll(queryOptions);

            const postIdArray = postIds.map((comment) => comment.postId);
            if (postIdArray.length === 0) return [];

            // Lấy thông tin về người đăng bài
            let posts = await postService.getAllPostByIds(postIdArray);

            // Lấy thông tin về người đăng bài
            for (let i = 0; i < posts.length; i++) {
                const user = await userService.getUserById(posts[i].postedBy);

                // Thêm thông tin người đăng bài là một thuộc tính của bài viết
                posts[i].dataValues.user = {
                    id: user.id,
                    fullname: user.fullname,
                    avatar: user.avatar,
                };
                console.log(posts[i]);
            }

            return posts;
        } catch (error) {
            throw new Error(`Lỗi khi lấy bài viết mới nhất: ${error.message}`);
        }
    },
};

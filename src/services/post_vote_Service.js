const { PostVote, Post, User } = require("../models");
const postService = require("./postService");
const Sequelize = require("sequelize");
const eventService = require("./eventService");
const post_eventService = require("./post_event_Service");
const userService = require("./userService");

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
            if (postIdArray.length === 0) return [];

            // Thực hiện truy vấn kết hợp để lấy thông tin từ cả hai bảng
            const posts = await Post.findAll({
                where: {
                    id: postIdArray,
                },
                include: [
                    {
                        model: User,
                        attributes: ["id", "fullname", "avatar"], // Chỉ lấy các trường fullname và avatar
                    },
                ],
            });

            // Tính số lượng upvote, downvote và vote cho mỗi bài đăng
            for (let i = 0; i < posts.length; i++) {
                const post = posts[i];
                const upvotes = await PostVote.count({
                    where: {
                        postId: post.id,
                        voteTypeId: 1, // upvote
                    },
                });
                const downvotes = await PostVote.count({
                    where: {
                        postId: post.id,
                        voteTypeId: 2, // downvote
                    },
                });
                const vote = upvotes - downvotes;

                // Thêm thông tin số upvote, downvote và vote vào mỗi bài đăng
                post.setDataValue("upvotesCount", upvotes);
                post.setDataValue("downvotesCount", downvotes);
                post.setDataValue("voteCount", vote);
            }

            return posts;
        } catch (error) {
            throw new Error(
                `Error fetching posts by user ID: ${error.message}`
            );
        }
    },

    getPostsHot: async (size, postId, eventId, currentUserID) => {
        try {
            const postIds = await PostVote.findAll({
                attributes: [
                    "postId",
                    [
                        Sequelize.literal(
                            "SUM(CASE WHEN voteTypeId = 1 THEN 1 ELSE 0 END)"
                        ),
                        "upvotes",
                    ],
                    [
                        Sequelize.literal(
                            "SUM(CASE WHEN voteTypeId = 2 THEN 1 ELSE 0 END)"
                        ),
                        "downvotes",
                    ],
                ],
                group: ["postId"],
                limit: size,
                order: [[Sequelize.literal("(upvotes - downvotes)"), "DESC"]],
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

            // Lấy thông tin về người đăng bài từ bảng User
            const posts = await postService.getAllPostByIds(selectedIds);
            const users = await userService.getAllUser();

            // Lấy thông tin về vote của currentUserID cho các bài post
            const currentUserVotes = await PostVote.findAll({
                where: {
                    userId: currentUserID,
                    postId: selectedIds,
                },
                attributes: ["postId", "voteTypeId"],
            });

            // Gán thông tin về người đăng bài và số lượng upvote, downvote cho mỗi bài viết
            posts.forEach((post) => {
                const user = users.find((user) => user.id === post.postedBy);
                if (user) {
                    post.dataValues.User = {
                        id: user.id,
                        fullname: user.fullname,
                        avatar: user.avatar,
                    };
                }

                post.dataValues.upvotesCount = 0;
                post.dataValues.downvotesCount = 0;
                post.dataValues.voteCount = 0;
                post.dataValues.currentUserUpvoted = false;
                post.dataValues.currentUserDownvoted = false;

                if (postIds.length > 0) {
                    const voteData = postIds.find(
                        (item) => item.postId === post.id
                    );
                    if (voteData !== undefined) {
                        post.dataValues.upvotesCount =
                            voteData.dataValues.upvotes;
                        post.dataValues.downvotesCount =
                            voteData.dataValues.downvotes;
                        post.dataValues.voteCount =
                            voteData.dataValues.upvotes -
                            voteData.dataValues.downvotes;
                    }
                }

                if (currentUserVotes.length > 0) {
                    const userVote = currentUserVotes.find(
                        (vote) => vote.postId === post.id
                    );
                    if (userVote !== undefined) {
                        post.dataValues.currentUserUpvoted =
                            userVote && userVote.dataValues.voteTypeId === 1;
                        post.dataValues.currentUserDownvoted =
                            userVote && userVote.dataValues.voteTypeId === 2;
                    }
                }
            });

            return posts;
        } catch (error) {
            throw new Error(
                `Error fetching posts by user ID: ${error.message}`
            );
        }
    },
    getPostVotes: async (postIdArray) => {
        try {
            const postVotes = await PostVote.findAll({
                where: {
                    postId: postIdArray,
                },
                attributes: [
                    "postId",
                    [
                        Sequelize.fn(
                            "SUM",
                            Sequelize.literal(
                                "CASE WHEN voteTypeId = 1 THEN 1 ELSE 0 END"
                            )
                        ),
                        "upvotes",
                    ],
                    [
                        Sequelize.fn(
                            "SUM",
                            Sequelize.literal(
                                "CASE WHEN voteTypeId = 2 THEN 1 ELSE 0 END"
                            )
                        ),
                        "downvotes",
                    ],
                ],
                group: ["postId"],
            });

            return postVotes;
        } catch (error) {
            throw new Error(`Error getting post votes: ${error.message}`);
        }
    },
};

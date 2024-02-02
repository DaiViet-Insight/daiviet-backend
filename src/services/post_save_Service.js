const { PostSave, User } = require("../models");
const postService = require("./postService");
const post_vote_Service = require("./post_vote_Service");

module.exports = {
    create: async (postId, userId) => {
        try {
            const isExist = await PostSave.findOne({
                where: {
                    postId: postId,
                    userId: userId,
                },
            });
            console.log(isExist);
            if (isExist) {
                await PostSave.destroy({
                    where: {
                        userId: userId,
                        postId: postId,
                    },
                });
                console.log("destroyed");
                return null;
            } else {
                const postSave = await PostSave.create({
                    postId: postId,
                    userId: userId,
                });
                console.log("created");
                return postSave;
            }
        } catch (error) {
            throw new Error(`Error creating post save: ${error.message}`);
        }
    },
    getPostsByUserId: async (userId) => {
        try {
            const postIds = await PostSave.findAll({
                where: {
                    userId: userId,
                },
                attributes: ["postId"],
            });
            const postIdArray = postIds.map((postSave) => postSave.postId);
            if (postIdArray.length === 0) {
                return [];
            }

            // Lấy thông tin bổ sung từ bảng User
            const posts = await postService.getAllPostByIds(postIdArray);

            // Lấy thông tin id, fullname, avatar từ bảng User
            for (let i = 0; i < posts.length; i++) {
                const user = await User.findOne({
                    where: {
                        id: posts[i].postedBy,
                    },
                    attributes: ["id", "fullname", "avatar"],
                });
                posts[i].dataValues.User = user; // Gán thông tin user vào trong post
            }

            // Lấy thông tin vote cho các bài viết
            const postVotes = await post_vote_Service.getPostVotes(postIdArray);

            // Kết hợp thông tin vote vào các bài viết
            for (let i = 0; i < posts.length; i++) {
                const voteInfo = postVotes.find(
                    (vote) => vote.postId === posts[i].id
                );
                if (voteInfo) {
                    posts[i].dataValues.upvotesCount = voteInfo.upvotes || 0;
                    posts[i].dataValues.downvotesCount =
                        voteInfo.downvotes || 0;
                    posts[i].dataValues.voteCount =
                        (voteInfo.upvotes || 0) - (voteInfo.downvotes || 0);
                } else {
                    posts[i].dataValues.upvotesCount = 0;
                    posts[i].dataValues.downvotesCount = 0;
                    posts[i].dataValues.voteCount = 0;
                }
            }

            return posts;
        } catch (error) {
            throw new Error(`Error getting post save: ${error.message}`);
        }
    },
};

const { PostSave } = require("../models");
const postService = require("./postService");

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
            const posts = await postService.getAllPostByIds(postIdArray);
            return posts;
        } catch (error) {
            throw new Error(`Error getting post save: ${error.message}`);
        }
    },
};

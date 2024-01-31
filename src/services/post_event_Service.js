const { PostEvent } = require("../models");

module.exports = {
    createPostEvent: async (postID, eventID) => {
        try {
            const postEvent = await PostEvent.create({
                postId: postID,
                eventId: eventID,
            });
            return postEvent;
        } catch (error) {
            throw new Error(`Error creating post event: ${error.message}`);
        }
    },
    getPostIdsByEventId: async (eventId) => {
        try {
            const postIds = await PostEvent.findAll({
                where: {
                    eventId: eventId,
                },
                attributes: ["postId"],
            });
            const postIdArray = postIds.map((postEvent) => postEvent.postId);
            return postIdArray;
        } catch (error) {
            throw new Error(`Error getting post event: ${error.message}`);
        }
    },
};

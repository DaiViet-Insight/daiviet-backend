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
};

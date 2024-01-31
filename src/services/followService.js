const { Follow } = require("../models");
const eventService = require("./eventService");

module.exports = {
    followEvent: async (eventId, userId) => {
        try {
            const follow = await Follow.create({
                eventId: eventId,
                userId: userId,
            });
            return follow;
        } catch (error) {
            throw new Error(`Error following user: ${error.message}`);
        }
    },
    getEventsByUserId: async (userId) => {
        try {
            const eventIds = await Follow.findAll({
                where: {
                    userId: userId,
                },
                attributes: ["eventId"],
            });
            const eventIdArray = eventIds.map((follow) => follow.eventId);
            const events = await eventService.getAllEventByIds(eventIdArray);
            return events;
        } catch (error) {
            throw new Error(
                `Error fetching events by user ID: ${error.message}`
            );
        }
    },
};

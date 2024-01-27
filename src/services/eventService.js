const { Event } = require("../models");

module.exports = {
    getAllEventByIds: async (eventIds) => {
        try {
            const events = await Event.findAll({
                where: {
                    id: eventIds,
                },
            });
            return events;
        } catch (error) {
            throw new Error(`Error fetching events by IDs: ${error.message}`);
        }
    },
    getAllEvent: async () => {
        try {
            const events = await Event.findAll();
            return events;
        } catch (error) {
            throw new Error(`Error fetching events: ${error.message}`);
        }
    },
    getEventById: async (eventId) => {
        try {
            const event = await Event.findOne({
                where: {
                    id: eventId,
                },
            });
            return event;
        } catch (error) {
            throw new Error(`Error fetching event by ID: ${error.message}`);
        }
    },
};

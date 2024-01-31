const EventService = require("../services/eventService");
const FollowService = require("../services/followService");
const jwtService = require("../services/jwtService");

module.exports = {
    getAllEvent: async (req, res) => {
        try {
            const events = await EventService.getAllEvent();
            res.status(200).json(events);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },
    followEvent: async (req, res) => {
        try {
            const userId = jwtService.decodeToken(req.session.token).id;
            const eventId = req.params.eventId;
            await FollowService.followEvent(eventId, userId);
            res.status(200).json("Follow event successfully");
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },
};

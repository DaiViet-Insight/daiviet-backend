const lectureEventService = require("../services/lecture_event_Service");
const lectureService = require("../services/lectureService");

module.exports = {
    getLectureByEventId: async (req, res) => {
        try {
            const eventId = req.query.eventId;
            const size = parseInt(req.query.size);
            const lectures = await lectureEventService.getLectureByEventId(
                eventId,
                size
            );
            res.status(200).json(lectures);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },
    getLectureById: async (req, res) => {
        try {
            const lectureId = req.params.id;
            const lecture = await lectureService.getLectureById(lectureId);
            res.status(200).json(lecture);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },
};

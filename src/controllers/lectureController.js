const lectureEventService = require("../services/lecture_event_Service");
const lectureService = require("../services/lectureService");

module.exports = {
    getLectures: async (req, res) => {
        try {
            const eventId = req.query.eventId || null;
            const size = parseInt(req.query.size)|| 10;
            
            const lectures = await lectureEventService.getLectures(
                eventId,
                size
            );
            res.status(200).json(lectures);
        } 
        
        
        catch (error) {
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
    createLecture: async (req, res) => {
        try {
            const lecture = await lectureService.createLecture(req);
            res.status(201).json(lecture);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

};

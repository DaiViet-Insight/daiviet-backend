const { Lecture } = require("../models");
const eventService = require("./eventService");
const lecture_eventService = require("./lecture_event_Service");
const jwt = require("jsonwebtoken");
module.exports = {
    createLecture: async (req) => {
        try {
            const eventIds = req.body.eventIds || [];
            const events = await eventService.getAllEventByIds(eventIds);
            if (eventIds.length !== events.length) {
                throw new Error("Sự kiện không tồn tại");
            }
            const token = req.headers.authorization.substring(7);
            const decoded = jwt.verify(token, "secret");



            let LectureObject = {
                title: req.body.title,
                content: req.body.content,
                authorId: decoded.id,
                videoURL: req.body.videoURL,
                thumbnail: req.body.thumbnail,                
            };
            const newLecture = await Lecture.create(LectureObject);

            for (let i = 0; i < events.length; i++) {
                await lecture_eventService.createEventLecture(newLecture.id, events[i].id);
            }

            return newLecture;
        } catch (error) {
            throw new Error(`Error creating lecture: ${error.message}`);
        }
    },


    getLecturesByIds: async (lectureIds) => {
        try {
            const lectures = await Lecture.findAll({
                where: {
                    id: lectureIds,
                },
            });
            return lectures;
        } catch (error) {
            throw new Error(`Error fetching lectures by IDs: ${error.message}`);
        }
    },
    getLectureById: async (lectureId) => {
        try {
            const lecture = await Lecture.findOne({
                where: {
                    id: lectureId,
                },
            });
            return lecture;
        } catch (error) {
            throw new Error(`Error fetching lecture by ID: ${error.message}`);
        }
    },
};

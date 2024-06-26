const { Lecture, User , Event, LectureEvent} = require("../models");
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
                await LectureEvent.create({
                    lectureId: newLecture.id,
                    EventId: events[i].id,
                });
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
    getLectures: async (eventId, size) => {
        try {
            let queryOptions = {};

            queryOptions = {
                attributes: ["id", "title", "content", "videoURL", "thumbnail"],
                include: [
                    {
                        model: User,
                        attributes: ["id", "fullname", "username", "avatar"],
                    },
                    {
                        model: Event,
                        attributes: ["id", "name"],
                        through: {
                            attributes: [],
                        },
                    },
                ],
            };

            if (eventId) {
                queryOptions.include[1].where = {
                    id: eventId,
                };
            }

            queryOptions.limit = size;

            const lectures = await Lecture.findAll(queryOptions);
            return lectures;
        } catch (error) {
            throw new Error(`Error fetching lectures: ${error.message}`);
        }
    },
    getLectureById: async (lectureId) => {
        try {
            const lecture = await Lecture.findOne({
                include :
                [
                    {
                        model: User,
                        attributes: ["id", "fullname","username", "avatar"],
                    },

                    {
                        model: Event,
                        attributes: ["id", "name"],
                        through: {
                            attributes: [],
                        },
                    },
                ],
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

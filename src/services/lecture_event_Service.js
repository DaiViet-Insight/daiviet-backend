const { LectureEvent } = require("../models");
const lectureService = require("./lectureService");

module.exports = {
    createEventLecture: async (lectureId, eventId) => {
        try {
            // const lectureId = req.body.lectureId;
            // const eventId = req.body.eventId;

            const lectureEvent = await LectureEvent.create({
                lectureId: lectureId,
                eventId: eventId,
            });

            return lectureEvent;
        } catch (error) {
            throw new Error(`Error creating lecture event: ${error.message}`);
        }
    },
    getLectures: async (eventId, size) => {
        try {
            let queryOptions = {};

            queryOptions = {
                attributes: ["lectureId"],
            };

            if (eventId) {
                queryOptions.where = {
                    eventId: eventId,
                };
            }
            queryOptions.limit = size;

            const lectureIds = await LectureEvent.findAll(queryOptions);
            const lectureIdArray = lectureIds.map(
                (lectureEvent) => lectureEvent.lectureId
            );
            const lectures = await lectureService.getLecturesByIds(
                lectureIdArray
            );
            return lectures;
        } catch (error) {
            throw new Error(`Error fetching lectures ${error.message}`);
        }
    },
    getEventsByLectureId: async (lectureId) => {
        try {
            const events = await LectureEvent.findAll({
                where: {
                    lectureId: lectureId,
                },
                attributes: [],
                include: "Event",
            });
            return events;
        } catch (error) {
            throw new Error(
                `Error fetching events by lectureId: ${error.message}`
            );
        }
    },
};

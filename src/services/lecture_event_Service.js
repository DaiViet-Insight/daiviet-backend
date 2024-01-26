const { LectureEvent } = require("../models");
const lectureService = require("./lectureService");

module.exports = {
    getLectureByEventId: async (eventId, size) => {
        try {
            let queryOptions = {
                where: {
                    eventId: eventId,
                },
                attributes: ["lectureId"],
            };
            if (size) {
                queryOptions.limit = size;
            }
            const lectureIds = await LectureEvent.findAll(queryOptions);
            const lectureIdArray = lectureIds.map(
                (lectureEvent) => lectureEvent.lectureId
            );
            const lectures = await lectureService.getLecturesByIds(
                lectureIdArray
            );
            return lectures;
        } catch (error) {
            throw new Error(
                `Error fetching lecture by event ID: ${error.message}`
            );
        }
    },
};

const { Lecture } = require("../models");

module.exports = {
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

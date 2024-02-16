const { ReportPost, Post, User } = require("../models");
const sequelize = require("sequelize");
module.exports = {
    reportPost: async (postId, reporterId, data) => {
        try {
            const report = await ReportPost.create({
                postId: postId,
                reporterId: reporterId,
                reason: data.reason,
                content: data.content,
                status: 0,
            });
            return report;
        } catch (error) {
            throw new Error(`Error reporting post: ${error.message}`);
        }
    },
    getReportPost: async () => {
        try {
            const reportedPosts = await ReportPost.findAll({
                attributes: ["postId"],
                group: ["postId"],
                having: sequelize.literal("COUNT(reporterId) > 0"),
                include: [
                    {
                        model: Post,
                        attributes: [
                            "id",
                            "title",
                            "content",
                            "createdAt",
                            "status",
                        ],
                        include: [
                            {
                                model: User,
                                attributes: ["id", "fullname", "avatar"],
                            },
                        ],
                    },
                ],
            });

            return reportedPosts;
        } catch (error) {
            throw new Error(`Error fetching reported posts: ${error.message}`);
        }
    },
};

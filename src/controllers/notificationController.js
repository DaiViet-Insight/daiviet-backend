const notificationService = require("../services/notificationService");

module.exports = {
    getAllNotification: async (req, res) => {
        try {
            const size = parseInt(req.query.top);
            const token = req.headers.authorization.substring(7);
            const notifications = await notificationService.getAllNotification(
                size,
                jwtService.decodeToken(token).id
            );
            res.status(200).json(notifications);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },
};

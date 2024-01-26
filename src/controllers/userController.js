const userService = require("../services/userService");
const followService = require("../services/followService");

module.exports = {
    login: async (req, res) => {
        try {
            const result = await userService.login(req.body);

            // Check if the result contains an error property
            if (result.error) {
                res.status(result.statusCode || 500).json({
                    error: result.message,
                });
            } else {
                req.session.token = result.token;
                res.status(200).json(result);
            }
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },
    getEventsByUserId: async (req, res) => {
        try {
            const userId = req.params.userId;
            const events = await followService.getEventsByUserId(userId);
            res.status(200).json(events);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },
    register: async (req, res) => {
        try {
            const result = await userService.register(req.body);

            // Check if the result contains an error property
            if (result.error) {
                res.status(result.statusCode || 500).json({
                    error: result.message,
                });
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },
};

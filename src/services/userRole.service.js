const {UserRole} = require('../models')

module.exports = {
    getRoleByUserId: async (userId) => {
        try {
            const role = await UserRole.findAll({
                where: {
                    userId: userId,
                },
            });

            return role;

        } catch (error) {
            throw new Error(`Error fetching role by user ID: ${error.message}`);
        }
    },
}
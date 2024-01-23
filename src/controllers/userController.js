const { User } = require('../models');

module.exports = {
    getUsers: async (req, res) => {
        const data = await User.findAll();
        res.send(data);
    },
    getUserById: (req, res) => {
        res.send('GET /users/:id');
    },
    createUser: (req, res) => {
        res.send('POST /users');
    },
    updateUser: (req, res) => {
        res.send('PUT /users/:id');
    },
    deleteUser: (req, res) => {
        res.send('DELETE /users/:id');
    }
};
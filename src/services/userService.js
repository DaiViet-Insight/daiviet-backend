const { User } = require("../models");
const jwt = require("jsonwebtoken");

module.exports = {
    login: async (data) => {
        try {
            const user = await User.findOne({
                where: {
                    username: data.username,
                    hashedPassword: data.password,
                },
            });

            if (!user) {
                return Promise.reject({
                    message: "Auth failed",
                    statusCode: 401,
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    fullname: user.fullname,
                    createdAt: user.createdAt,
                    birthday: user.birthday,
                    avatar: user.avatar,
                },
                "secret",
                {
                    expiresIn: "1h",
                }
            );

            const result = {
                message: "Auth successful",
                token: token,
            };

            return result;
        } catch (error) {
            return Promise.reject({
                message: "Internal Server Error",
                statusCode: 500,
            });
        }
    },
    register: async (data) => {
        try {
            const user = await User.create({
                username: data.username,
                hashedPassword: data.password,
                fullname: data.fullname,
                birthday: data.birthday,
                avatar: data.avatar,
            });

            const result = {
                message: "User created",
                user: {
                    id: user.id,
                    username: user.username,
                    fullname: user.fullname,
                    birthday: user.birthday,
                    avatar: user.avatar,
                },
            };

            return result;
        } catch (error) {
            return Promise.reject({
                message: "Internal Server Error",
                statusCode: 500,
            });
        }
    }
};

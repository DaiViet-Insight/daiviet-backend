const { User, UserRole, Role } = require("../models");
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

            const userRole = await UserRole.findOne({
                where: {
                    userId: user.id,
                },
                include: [
                    {
                        model: Role,
                        attributes: ["roleName"],
                    },
                ],
            });

            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    fullname: user.fullname,
                    createdAt: user.createdAt,
                    birthday: user.birthday,
                    avatar: user.avatar,
                    role: userRole.Role.roleName,
                },
                "secret",
                {
                    expiresIn: "24h",
                }
            );
            console.log(token);
            const result = {
                message: "Auth successful",
                token: token,
            };

            return result;
        } catch (error) {
            console.log(error);
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
    },
    getUserById: async (id) => {
        try {
            const user = await User.findByPk(id, {
                attributes: [
                    "id",
                    "fullname",
                    "createdAt",
                    "birthday",
                    "avatar",
                ],
            });

            if (!user) {
                return Promise.reject({
                    message: "User not found",
                    statusCode: 404,
                });
            }

            const userRole = await UserRole.findOne({
                where: {
                    userId: user.id,
                },
                include: [
                    {
                        model: Role,
                        attributes: ["roleName"],
                    },
                ],
            });

            const result = {
                id: user.id,
                fullname: user.fullname,
                createdAt: user.createdAt,
                birthday: user.birthday,
                avatar: user.avatar,
                role: userRole.Role.roleName,
            };

            return result;
        } catch (error) {
            return Promise.reject({
                message: "Internal Server Error",
                statusCode: 500,
            });
        }
    },
    getAllUser: async () => {
        try {
            const users = await User.findAll({
                attributes: ["id", "fullname", "avatar"],
            });

            return users;
        } catch (error) {
            return Promise.reject({
                message: "Internal Server Error",
                statusCode: 500,
            });
        }
    },
};

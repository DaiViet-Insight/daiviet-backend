"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class NotificationComment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            NotificationComment.belongsTo(models.Comment, {
                foreignKey: "commentId",
            });
        }
    }
    NotificationComment.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            commentId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            title: {
                type: DataTypes.STRING(32),
            },
            content: {
                type: DataTypes.STRING(64),
            },
            createdAt: {
                type: DataTypes.DATEONLY,
            },
        },
        {
            sequelize,
            modelName: "NotificationComment",
            timestamps: false,
        }
    );

    // initizlize NotificationComment data
    NotificationComment.initData = async function () {
        await this.bulkCreate([
            {
                id: "460c6896-dec1-4e65-ba0b-fcbd07b48e84",
                commentId: "7e67418e-4531-49d2-8c79-f79f310d009b",
                title: "Đã có bình luận mới",
                content:
                    "Cách mạng tháng 8 năm 1945 mang lại độc lập cho Việt Nam",
                createdAt: "2024-01-01",
            },
        ]);
    };

    return NotificationComment;
};

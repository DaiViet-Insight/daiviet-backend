"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ReportPost extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.ReportPost.belongsTo(models.Post, {
                foreignKey: "postId",
                onDelete: "CASCADE",
            });

            models.ReportPost.belongsTo(models.User, {
                foreignKey: "reporterId",
                onDelete: "CASCADE",
            });
        }
    }
    ReportPost.init(
        {
            postId: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            reporterId: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            reason: {
                type: DataTypes.STRING(128),
            },
            content: {
                type: DataTypes.TEXT,
            },
            status: {
                type: DataTypes.INTEGER,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "ReportPost",
            timestamps: false,
        }
    );

    // initizlize ReportPost data
    ReportPost.initData = async function () {
        await this.bulkCreate([
            {
                postId: "59928e6b-d2c8-4620-b699-028ca0811afe",
                reporterId: "867940fd-37f4-4120-b20a-ed64a39c9434",
                reason: "Spam",
                content: "Spam",
                status: 0,
                createdAt: new Date(),
            },
        ]);
    };

    return ReportPost;
};

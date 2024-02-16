'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NotificationPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        NotificationPost.belongsTo(models.Post, {
            foreignKey: 'postId'
        });
    }
  }
  NotificationPost.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    postId: {
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
        type: DataTypes.DATEONLY
    },
  }, {
    sequelize,
    modelName: 'NotificationPost',
    timestamps: false,
  });

  // initizlize NotificationPost data
  NotificationPost.initData = async function() {
    await this.bulkCreate([
      {
        id: '5fa6c80d-4454-431d-bfda-783c5cc5f267',
        postId: '59928e6b-d2c8-4620-b699-028ca0811afe',
        title: 'Đã có bài viết mới',
        content: 'Cách mạng tháng 8 năm 1945 mang lại độc lập cho Việt Nam',
        createdAt: '2024-01-01'
      }
    ]);
  }

  return NotificationPost;
};
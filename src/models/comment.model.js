'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.Post, {
        foreignKey: 'postId'
      });

      Comment.belongsTo(models.User, {
        foreignKey: 'postedBy'
      });

      Comment.belongsTo(models.Comment, {
        foreignKey: 'rootCommentId'
      });
    }
  }
  Comment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    postId: {
      type: DataTypes.UUID
    },
    content: {
      type: DataTypes.STRING(1024)
    },
    postedBy: {
      type: DataTypes.UUID
    },
    rootCommentId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
  }, {
    sequelize,
    modelName: 'Comment',
    timestamps: false,
  });

  // initizlize Comment data
  Comment.initData = async function() {
    await this.bulkCreate([
      {
        id: '9f8e1cb8-e9fc-4ca3-a297-a88ed8f273f1',
        postId: '59928e6b-d2c8-4620-b699-028ca0811afe',
        content: 'This is a comment',
        postedBy: '867940fd-37f4-4120-b20a-ed64a39c9434',
        rootCommentId: null,
      },
      {
        id: '7e67418e-4531-49d2-8c79-f79f310d009b',
        postId: '59928e6b-d2c8-4620-b699-028ca0811afe',
        content: 'This is a reply comment',
        postedBy: '867940fd-37f4-4120-b20a-ed64a39c9434',
        rootCommentId: '9f8e1cb8-e9fc-4ca3-a297-a88ed8f273f1',
      }
    ]);
  }

  return Comment;
};
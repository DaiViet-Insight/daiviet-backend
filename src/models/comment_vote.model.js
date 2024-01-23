'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CommentVote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        models.CommentVote.belongsTo(models.User, {
            foreignKey: 'userId'
        });

        models.CommentVote.belongsTo(models.Comment, {
            foreignKey: 'commentId'
        });

        models.CommentVote.belongsTo(models.VoteType, {
            foreignKey: 'voteTypeId'
        });
    }
  }
  CommentVote.init({
    userId : {
      type: DataTypes.UUID,
      primaryKey: true
    },
    commentId: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    voteTypeId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
  }, {
    sequelize,
    modelName: 'CommentVote',
    timestamps: false,
  });

  // initizlize CommentVote data
  CommentVote.initData = async function() {
    await this.bulkCreate([
      { 
        userId: '867940fd-37f4-4120-b20a-ed64a39c9434',
        commentId: '9f8e1cb8-e9fc-4ca3-a297-a88ed8f273f1',
        voteTypeId: 1
      }
    ]);
  }

  return CommentVote;
};
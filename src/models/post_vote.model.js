'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PostVote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        models.PostVote.belongsTo(models.User, {
            foreignKey: 'userId'
        });

        models.PostVote.belongsTo(models.Post, {
            foreignKey: 'postId'
        });

        models.PostVote.belongsTo(models.VoteType, {
            foreignKey: 'voteTypeId'
        });
    }
  }
  PostVote.init({
    userId : {
      type: DataTypes.UUID,
      primaryKey: true
    },
    postId: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    voteTypeId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
  }, {
    sequelize,
    modelName: 'PostVote',
    timestamps: false,
  });

  // initizlize PostVote data
  PostVote.initData = async function() {
    await this.bulkCreate([
      {
        userId: '867940fd-37f4-4120-b20a-ed64a39c9434',
        postId: '59928e6b-d2c8-4620-b699-028ca0811afe',
        voteTypeId: 1
      }
    ]);
  }

  return PostVote;
};
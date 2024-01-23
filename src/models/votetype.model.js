'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VoteType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  }
  VoteType.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
        type: DataTypes.STRING(16),
        unique: true
    },
  }, {
    sequelize,
    modelName: 'VoteType',
    timestamps: false,
  });

  // initizlize VoteType data
  VoteType.initData = async function() {
    await this.bulkCreate([
      {
        id: 1,
        name: 'Upvote'
      },
      {
        id: 2,
        name: 'Downvote'
      }
    ]);
  }

  return VoteType;
};
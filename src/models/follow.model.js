'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        models.Follow.belongsTo(models.Event, {
            foreignKey: 'eventId'
        });
        models.Follow.belongsTo(models.User, {
            foreignKey: 'userId'
        });
    }
  }
  Follow.init({
    eventId: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        primaryKey: true
    },
  }, {
    sequelize,
    modelName: 'Follow',
    timestamps: false,
  });

  // initizlize Follow data
  Follow.initData = async function() {
    await this.bulkCreate([
      {
        eventId: 'bc618a64-25f9-44dd-91b5-f8251f3bf6b9',
        userId: '867940fd-37f4-4120-b20a-ed64a39c9434'
      }
    ]);
  }

  return Follow;
};
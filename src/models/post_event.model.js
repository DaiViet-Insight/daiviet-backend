'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PostEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        models.PostEvent.belongsTo(models.Post, {
            foreignKey: 'postId'
        });

        models.PostEvent.belongsTo(models.Event, {
            foreignKey: 'eventId'
        });
    }
  }
  PostEvent.init({
    postId: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    eventId: {
        type: DataTypes.UUID,
        primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'PostEvent',
    timestamps: false,
  });

  // initizlize Event data
  PostEvent.initData = async function() {
    await this.bulkCreate([
      { 
        postId: '59928e6b-d2c8-4620-b699-028ca0811afe',
        eventId: 'bc618a64-25f9-44dd-91b5-f8251f3bf6b9'
      }
    ]);
  }

  return PostEvent;
};
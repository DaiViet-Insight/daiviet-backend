'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EventCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
      static associate(models) {
        models.EventCategory.belongsTo(models.Event, {
            foreignKey: 'eventId'
        });
        models.EventCategory.belongsTo(models.Category, {
            foreignKey: 'categoryId'
        });
    }
  }
  EventCategory.init({
    eventId: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    categoryId: {
        type: DataTypes.UUID,
        primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'EventCategory',
    timestamps: false,
  });

  // initizlize EventCategory data
  EventCategory.initData = async function() {
    await this.bulkCreate([
     {
      eventId: 'bc618a64-25f9-44dd-91b5-f8251f3bf6b9',
      categoryId: 'cbc7d005-f111-41df-8102-59832c1cc18e'
     }
    ]);
  }

  return EventCategory;
};
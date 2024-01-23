'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  }
  Event.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(128),
      unique: true
    },
    content: {
      type: DataTypes.TEXT
    },
    startDate: {
      type: DataTypes.DATEONLY
    },
    endDate: {
      type: DataTypes.DATEONLY
    },
  }, {
    sequelize,
    modelName: 'Event',
    timestamps: false,
  });

  // initizlize Event data
  Event.initData = async function() {
    await this.bulkCreate([
      { 
        id: 'bc618a64-25f9-44dd-91b5-f8251f3bf6b9',
        name: 'Cách mạng tháng 8 năm 1945',
        content: 'Cách mạng tháng 8 năm 1945',
        startDate: '1945-08-19',
        endDate: '1945-08-19'
      }
    ]);
  }

  return Event;
};
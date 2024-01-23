'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LectureEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        models.LectureEvent.belongsTo(models.Event, {
            foreignKey: 'eventId'
        });

        models.LectureEvent.belongsTo(models.Lecture, {
            foreignKey: 'lectureId'
        });
    }
  }
  LectureEvent.init({
    lectureId: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    eventId: {
        type: DataTypes.UUID,
        primaryKey: true
    },
  }, {
    sequelize,
    modelName: 'LectureEvent',
    timestamps: false,
  });

  // initizlize LectureEvent data
  LectureEvent.initData = async function() {
    await this.bulkCreate([
      { 
        lectureId: 'd9e0d6d4-6a9f-4c6a-9f8f-8f4a7f5f8f4a',
        eventId: 'bc618a64-25f9-44dd-91b5-f8251f3bf6b9'
      }
    ]);
  }

  return LectureEvent;
};
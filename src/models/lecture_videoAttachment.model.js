'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LectureEventAttachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        models.LectureEventAttachment.belongsTo(models.Lecture, {
            foreignKey: 'lectureId'
        });
    }
  }
  LectureEventAttachment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    lectureId: {
      type: DataTypes.UUID
    },
    videoUrl: {
      type: DataTypes.STRING(256)
    },
  }, {
    sequelize,
    modelName: 'LectureEventAttachment',
    timestamps: false,
  });

  // initizlize LectureEventAttachment data
  LectureEventAttachment.initData = async function() {
    await this.bulkCreate([
      { 
        id: 'e934741a-3cf9-4c72-8d99-7640b8b53439',
        lectureId: 'd9e0d6d4-6a9f-4c6a-9f8f-8f4a7f5f8f4a',
        videoUrl: 'https://www.youtube.com/watch?v=zgR6nH84wsQ'
      }
    ]);
  }

  return LectureEventAttachment;
};
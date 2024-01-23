'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Lecture extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Lecture.belongsTo(models.User, {
          foreignKey: 'authorId'
      });
    }
  }
  Lecture.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    authorId: {
        type: DataTypes.UUID
    },
    title: {
        type: DataTypes.STRING(128)
    },
    content: {
        type: DataTypes.TEXT
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    description: {
        type: DataTypes.STRING(256)
    },
    thumbnail: {
        type: DataTypes.STRING(256)
    },
  }, {
    sequelize,
    modelName: 'Lecture',
    timestamps: false,
  });

  // initizlize Lecture data
  Lecture.initData = async function() {
    await this.bulkCreate([
      { 
        id: 'd9e0d6d4-6a9f-4c6a-9f8f-8f4a7f5f8f4a',
        authorId: '867940fd-37f4-4120-b20a-ed64a39c9434',
        title: 'Lịch sử Việt Nam',
        content: 'Lịch sử Việt Nam',
        description: 'Lịch sử Việt Nam',
        thumbnail: 'https://tuyengiao.hagiang.gov.vn/upload/64711/20220818/Nhan_dan_ta_vui_mung_phan_khoi_sau_Cach_mang_Thang_8_f411f.jpg'
      }
    ]);
  }

  return Lecture;
};
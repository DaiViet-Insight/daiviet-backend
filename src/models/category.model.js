'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        
    }
  }
  Category.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(128),
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Category',
    timestamps: false,
  });

  // initizlize Category data
  Category.initData = async function() {
    await this.bulkCreate([
      { 
        id: 'cbc7d005-f111-41df-8102-59832c1cc18e',
        name: 'Lịch sử Việt Nam' 
      },
      { 
        id: 'c87a8e99-504e-4b1a-b97f-62b6f218d4d2',
        name: 'Lịch sử thế giới'
      },
      { 
        id: '3449ee32-7853-4b55-8ff7-99fd91c9cc1a',
        name: 'Lịch sử châu Á'
      },
      { 
        id: '627ef5a0-d36d-44ad-b68c-b9fb11de2fc4',
        name: 'Lịch sử châu Âu'
      }
    ]);
  }

  return Category;
};
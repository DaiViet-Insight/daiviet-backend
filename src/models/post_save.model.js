'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PostSave extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        models.PostSave.belongsTo(models.User, {
            foreignKey: 'userId'
        });

        models.PostSave.belongsTo(models.Post, {
            foreignKey: 'postId'
        });
    }
  }
  PostSave.init({
    postId: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      primaryKey: true
    },
  }, {
    sequelize,
    modelName: 'PostSave',
    timestamps: false,
  });

  // initizlize PostSave data
  PostSave.initData = async function() {
    await this.bulkCreate([
      {
        userId: '867940fd-37f4-4120-b20a-ed64a39c9434',
        postId: '59928e6b-d2c8-4620-b699-028ca0811afe'
      }
    ]);
  }

  return PostSave;
};
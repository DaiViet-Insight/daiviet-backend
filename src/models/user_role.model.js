'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        UserRole.belongsTo(models.Role, {
            foreignKey: 'roleId'
        });
        UserRole.belongsTo(models.User, {
            foreignKey: 'userId'
        });
    }
  }
  UserRole.init({
    userId: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    roleId: {
        type: DataTypes.UUID,
        primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'UserRole',
    timestamps: false
  });

  // initizlize UserRole data
  UserRole.initData = async function() {
    await this.bulkCreate([
     {
      userId: '71fdfcf5-99b3-4892-a626-5e73f96cd89d',
      roleId: '71fdfcf5-99b3-4892-a626-5e73f96cd89c'
     },
     {
      userId: '867940fd-37f4-4120-b20a-ed64a39c9434',
      roleId: '9b4b7a8e-7d7d-4a1f-9e3d-4c8d0a9b2e6e'
     }
    ]);
  }
  return UserRole;
};
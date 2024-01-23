'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Role.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    roleName: {
      type: DataTypes.STRING(64),
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Role',
    timestamps: false
  });

  // initizlize Role data
  Role.initData = async function() {
    await this.bulkCreate([
      { 
        id: '71fdfcf5-99b3-4892-a626-5e73f96cd89c',
        roleName: 'admin' 
      },
      { 
        id: '9b4b7a8e-7d7d-4a1f-9e3d-4c8d0a9b2e6e',
        roleName: 'user'
      },
      { 
        id: 'c3b6c1a3-1a9e-4f4e-8a7d-3e7c3a8c5c9e',
        roleName: 'contributor'
      },
      { 
        id: 'e2f8c5b9-3b3f-4e9d-9b4e-4b8b7a8b4b7a',
        roleName: 'moderator'
      }
    ]);
  }
  return Role;
};
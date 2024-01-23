'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(64),
      unique: true
    },
    hashedPassword: {
      type: DataTypes.STRING(64)
    },
    fullname: {
      type: DataTypes.STRING(64)
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    birthday: {
      type: DataTypes.DATEONLY
    },
    avatar: {
      type: DataTypes.STRING(128)
    },
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false,
  });

  // initizlize User data
  User.initData = async function() {
    await this.bulkCreate([{
      id: '71fdfcf5-99b3-4892-a626-5e73f96cd89d',
      username: 'tuan',
      hashedPassword: '12345678',
      fullname: 'Tran Huu Tuan',
      createdAt: new Date(),
      birthday: '2003-01-01',
      avatar: 'https://i.pinimg.com/originals/3d/5a/4b/3d5a4b1e3a5f5e9e0a1e4c9c8f7b9b6e.jpg'
    },
    {
      id: '867940fd-37f4-4120-b20a-ed64a39c9434',
      username: 'tuanne',
      hashedPassword: '12345678',
      fullname: 'Tran Tuan',
      createdAt: new Date(),
      birthday: '2003-01-02',
      avatar: 'https://i.pinimg.com/originals/3d/5a/4b/3d5a4b1e3a5f5e9e0a1e4c9c8f7b9b6e.jpg'
    }
  ]);
  }
  return User;
};
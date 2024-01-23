'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReportComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        models.ReportComment.belongsTo(models.Comment, {
          foreignKey: 'commentId',
          onDelete: 'CASCADE'
        });

        models.ReportComment.belongsTo(models.User, {
          foreignKey: 'reporterId',
          onDelete: 'CASCADE'
        });
    }
  }
  ReportComment.init({
    commentId: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    reporterId: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    reason: {
      type: DataTypes.STRING(128)
    },
    content: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.INTEGER
    },
    createdAt: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'ReportComment',
    timestamps: false,
  });

  // initizlize ReportComment data
  ReportComment.initData = async function() {
    await this.bulkCreate([
      {
        commentId: '7e67418e-4531-49d2-8c79-f79f310d009b',
        reporterId: '867940fd-37f4-4120-b20a-ed64a39c9434',
        reason: 'Spam',
        content: 'Spam',
        status: 0,
        createdAt: new Date()
      }
    ]);
  }

  return ReportComment;
};
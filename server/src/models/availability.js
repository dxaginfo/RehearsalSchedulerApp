'use strict';

module.exports = (sequelize, DataTypes) => {
  const Availability = sequelize.define('Availability', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 6
      },
      comment: '0 = Sunday, 1 = Monday, ..., 6 = Saturday'
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Higher number means higher priority'
    }
  }, {
    timestamps: true,
    underscored: true
  });

  Availability.associate = function(models) {
    // Associations
    Availability.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Availability;
};
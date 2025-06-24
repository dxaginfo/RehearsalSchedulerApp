'use strict';

module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    paranoid: true // Soft delete
  });

  // Associations
  Group.associate = function(models) {
    Group.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });

    Group.belongsToMany(models.User, {
      through: models.GroupMember,
      foreignKey: 'groupId',
      as: 'members'
    });

    Group.hasMany(models.Rehearsal, {
      foreignKey: 'groupId',
      as: 'rehearsals'
    });
  };

  return Group;
};
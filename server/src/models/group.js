'use strict';

module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
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
    createdById: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    timestamps: true,
    underscored: true
  });

  Group.associate = function(models) {
    // Associations
    Group.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'creator'
    });
    
    Group.belongsToMany(models.User, {
      through: 'GroupMember',
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
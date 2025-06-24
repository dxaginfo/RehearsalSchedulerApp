'use strict';

module.exports = (sequelize, DataTypes) => {
  const Rehearsal = sequelize.define('Rehearsal', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Groups',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    recurrencePattern: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'iCalendar RRULE format for recurring events'
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    parentRehearsalId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Rehearsals',
        key: 'id'
      },
      comment: 'For recurring rehearsals - links instance to parent'
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'scheduled'
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    underscored: true
  });

  Rehearsal.associate = function(models) {
    // Associations
    Rehearsal.belongsTo(models.Group, {
      foreignKey: 'groupId',
      as: 'group'
    });
    
    Rehearsal.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'creator'
    });
    
    Rehearsal.belongsToMany(models.User, {
      through: 'RehearsalAttendee',
      foreignKey: 'rehearsalId',
      as: 'attendees'
    });
    
    Rehearsal.belongsTo(models.Rehearsal, {
      foreignKey: 'parentRehearsalId',
      as: 'parentRehearsal'
    });
    
    Rehearsal.hasMany(models.Rehearsal, {
      foreignKey: 'parentRehearsalId',
      as: 'childRehearsals'
    });
    
    Rehearsal.hasMany(models.RehearsalItem, {
      foreignKey: 'rehearsalId',
      as: 'items'
    });
  };

  return Rehearsal;
};
'use strict';

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profileImageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    timeZone: {
      type: DataTypes.STRING,
      defaultValue: 'UTC'
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    paranoid: true, // Soft delete
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  // Instance methods
  User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  // Associations
  User.associate = function(models) {
    User.hasMany(models.Group, {
      foreignKey: 'createdBy',
      as: 'createdGroups'
    });

    User.belongsToMany(models.Group, {
      through: models.GroupMember,
      foreignKey: 'userId',
      as: 'groups'
    });

    User.hasMany(models.Availability, {
      foreignKey: 'userId',
      as: 'availabilities'
    });

    User.hasMany(models.AvailabilityException, {
      foreignKey: 'userId',
      as: 'availabilityExceptions'
    });

    User.hasMany(models.Attendance, {
      foreignKey: 'userId',
      as: 'attendances'
    });

    User.hasMany(models.Notification, {
      foreignKey: 'userId',
      as: 'notifications'
    });
  };

  return User;
};
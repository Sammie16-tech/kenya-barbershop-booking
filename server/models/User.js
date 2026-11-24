const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
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
    phoneNumber: {
      type: DataTypes.STRING,
      validate: {
        is: /^(\+254|0)[17]\d{8}$/
      }
    },
    role: {
      type: DataTypes.ENUM('client', 'shop_owner', 'admin'),
      defaultValue: 'client'
    },
    googleId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    profilePicture: {
      type: DataTypes.STRING
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLogin: {
      type: DataTypes.DATE
    },
    referralCode: {
      type: DataTypes.STRING,
      unique: true
    },
    referredBy: {
      type: DataTypes.UUID,
      allowNull: true
    },
    referralCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    referralRewards: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
        // Generate unique referral code
        if (!user.referralCode) {
          const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
          user.referralCode = `${user.firstName.substring(0, 3).toUpperCase()}${suffix}`;
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

  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return User;
};
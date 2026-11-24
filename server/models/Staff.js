const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Staff = sequelize.define('Staff', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      validate: { isEmail: true }
    },
    phoneNumber: {
      type: DataTypes.STRING
    },
    specialization: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }

  });

  return Staff;
};

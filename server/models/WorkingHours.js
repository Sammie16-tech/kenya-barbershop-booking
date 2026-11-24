const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WorkingHours = sequelize.define('WorkingHours', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    dayOfWeek: {
      type: DataTypes.INTEGER, // 0-6 (Sunday-Saturday)
      allowNull: false
    },
    openTime: {
      type: DataTypes.STRING, // "08:00"
      allowNull: false
    },
    closeTime: {
      type: DataTypes.STRING, // "18:00"
      allowNull: false
    },
    isClosed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return WorkingHours;
};

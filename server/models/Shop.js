const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Shop = sequelize.define('Shop', {
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
      type: DataTypes.TEXT
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    county: {
      type: DataTypes.STRING
    },
    constituency: {
      type: DataTypes.STRING
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^(\+254|0)[17]\d{8}$/
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    website: {
      type: DataTypes.STRING
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    totalReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    openingHours: {
      type: DataTypes.JSONB,
      defaultValue: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '09:00', close: '17:00' },
        sunday: { open: '10:00', close: '16:00' }
      }
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    mpesaShortcode: {
      type: DataTypes.STRING
    },
    mpesaPasskey: {
      type: DataTypes.STRING
    },
    mpesaConsumerKey: {
      type: DataTypes.STRING
    },
    mpesaConsumerSecret: {
      type: DataTypes.STRING
    },
    subscriptionPlan: {
      type: DataTypes.ENUM('monthly', 'yearly'),
      allowNull: true
    },
    subscriptionStatus: {
      type: DataTypes.ENUM('active', 'pending', 'expired', 'cancelled'),
      defaultValue: 'pending'
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    featuredUntil: {
      type: DataTypes.DATE
    }
  });

  return Shop;
};
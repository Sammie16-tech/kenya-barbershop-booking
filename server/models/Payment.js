const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING
    },
    merchantRequestId: {
      type: DataTypes.STRING
    },
    checkoutRequestId: {
      type: DataTypes.STRING
    },
    mpesaReceiptNumber: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'completed', 'failed']]
      }
    },
    failureReason: {
      type: DataTypes.TEXT
    },
    transactionDate: {
      type: DataTypes.DATE
    }
  });

  return Payment;
};

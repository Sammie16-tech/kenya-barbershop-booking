const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const User = require('./User')(sequelize);
const Shop = require('./Shop')(sequelize);
const Staff = require('./Staff')(sequelize);
const Service = require('./Service')(sequelize);
const Appointment = require('./Appointment')(sequelize);
const Review = require('./Review')(sequelize);
const Payment = require('./Payment')(sequelize);
const WorkingHours = require('./WorkingHours')(sequelize);
const Favorite = require('./Favorite')(sequelize);
const Notification = require('./Notification')(sequelize);
const Message = require('./Message')(sequelize);

// Associations
User.hasOne(Shop, { foreignKey: 'ownerId' });
Shop.belongsTo(User, { foreignKey: 'ownerId' });

User.hasMany(Favorite, { foreignKey: 'userId' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

Shop.hasMany(Favorite, { foreignKey: 'shopId' });
Favorite.belongsTo(Shop, { foreignKey: 'shopId' });

Shop.hasMany(Staff, { foreignKey: 'shopId' });
Staff.belongsTo(Shop, { foreignKey: 'shopId' });

Shop.hasMany(Service, { foreignKey: 'shopId' });
Service.belongsTo(Shop, { foreignKey: 'shopId' });

Shop.hasMany(WorkingHours, { foreignKey: 'shopId' });
WorkingHours.belongsTo(Shop, { foreignKey: 'shopId' });

Staff.hasMany(Appointment, { foreignKey: 'staffId' });
Appointment.belongsTo(Staff, { foreignKey: 'staffId' });

User.hasMany(Appointment, { foreignKey: 'clientId' });
Appointment.belongsTo(User, { foreignKey: 'clientId' });

Appointment.hasOne(Payment, { foreignKey: 'appointmentId' });
Payment.belongsTo(Appointment, { foreignKey: 'appointmentId' });

User.hasMany(Review, { foreignKey: 'clientId' });
Review.belongsTo(User, { foreignKey: 'clientId' });

Shop.hasMany(Review, { foreignKey: 'shopId' });
Review.belongsTo(Shop, { foreignKey: 'shopId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Message, { as: 'SentMessages', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });

User.hasMany(Message, { as: 'ReceivedMessages', foreignKey: 'receiverId' });
Message.belongsTo(User, { as: 'Receiver', foreignKey: 'receiverId' });

module.exports = {
  sequelize,
  User,
  Shop,
  Staff,
  Service,
  Appointment,
  Review,
  Payment,
  WorkingHours,
  Favorite,
  Notification,
  Message
};
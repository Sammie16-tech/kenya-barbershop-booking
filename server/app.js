const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shops');
const appointmentRoutes = require('./routes/appointments');
const paymentRoutes = require('./routes/payments');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');
const favoriteRoutes = require('./routes/favorites');
const notificationRoutes = require('./routes/notifications');
const messageRoutes = require('./routes/messages');
const { errorHandler } = require('./middleware/errorHandler');
const { initReminders } = require('./utils/scheduler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

// Passport config
require('./config/passport');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);

// Error handling
app.use(errorHandler);

// Database sync and server start (Modified for demo: ignore DB failure)
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log('Database connected');
}).catch(err => {
  console.error('Database connection failed (ignoring for demo):', err.message);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initReminders(); // Start automated SMS reminders
});

module.exports = app;
const { Appointment, Shop, Staff, Service, Payment, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment-timezone');

const EAT = 'Africa/Nairobi';

exports.createShop = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const ownerId = req.user.id;
    const { name, description, address, city, phoneNumber, latitude, longitude, mpesaShortcode, mpesaPasskey, services, staff, plan, billingPhone } = req.body;

    // Check if user already has a shop
    const existingShop = await Shop.findOne({ where: { ownerId } });
    if (existingShop) {
      await transaction.rollback();
      return res.status(400).json({ message: 'You already have a registered shop.' });
    }

    const shop = await Shop.create({
      ownerId,
      name,
      description,
      address,
      city,
      phoneNumber,
      latitude,
      longitude,
      mpesaShortcode,
      mpesaPasskey,
      subscriptionPlan: plan,
      subscriptionStatus: 'active', // In a real scenario, this would be 'pending' until M-Pesa confirms
      isActive: true
    }, { transaction });

    if (services && services.length > 0) {
      const servicesData = services.map(s => ({
        ...s,
        shopId: shop.id
      }));
      await Service.bulkCreate(servicesData, { transaction });
    }

    if (staff && staff.length > 0) {
      const staffData = staff.map(s => ({
        ...s,
        shopId: shop.id
      }));
      await Staff.bulkCreate(staffData, { transaction });
    }

    await transaction.commit();
    res.status(201).json({ message: 'Shop registered successfully!', shop });
  } catch (error) {
    await transaction.rollback();
    console.error('Create shop error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed: ' + error.errors.map(e => e.message).join(', ') 
      });
    }

    res.status(500).json({ message: 'Failed to create shop', error: error.message });
  }
};


exports.getDashboardStats = async (req, res) => {
  try {
    const shop = await Shop.findOne({ where: { ownerId: req.user.id } });
    
    if (!shop) {
      return res.status(404).json({ message: 'No shop found for this account. Please set up your shop first.' });
    }

    const shopId = shop.id;
    const today = moment.tz(EAT).format('YYYY-MM-DD');
    const startOfWeek = moment.tz(EAT).startOf('week').format('YYYY-MM-DD');
    const endOfWeek = moment.tz(EAT).endOf('week').format('YYYY-MM-DD');

    // Total bookings today
    const todayBookings = await Appointment.count({
      where: {
        shopId,
        appointmentDate: today,
        status: { [Op.notIn]: ['cancelled', 'no_show'] }
      }
    });

    // Today's revenue
    const todayRevenue = await Payment.sum('amount', {
      where: {
        status: 'completed',
        createdAt: {
          [Op.gte]: moment.tz(EAT).startOf('day').toDate()
        },
        '$Appointment.shopId$': shopId
      },
      include: [{
        model: Appointment,
        where: { shopId }
      }]
    }) || 0;

    // Weekly revenue
    const weeklyRevenue = await Payment.sum('amount', {
      where: {
        status: 'completed',
        createdAt: {
          [Op.between]: [
            moment.tz(startOfWeek, EAT).toDate(),
            moment.tz(endOfWeek, EAT).endOf('day').toDate()
          ]
        },
        '$Appointment.shopId$': shopId
      },
      include: [{
        model: Appointment,
        where: { shopId }
      }]
    }) || 0;

    // Upcoming appointments
    const upcomingAppointments = await Appointment.findAll({
      where: {
        shopId,
        appointmentDate: {
          [Op.gte]: today
        },
        status: 'confirmed'
      },
      include: [
        { model: Service, attributes: ['name', 'price'] },
        { model: Staff, attributes: ['firstName', 'lastName'] },
        { model: User, attributes: ['firstName', 'lastName', 'phoneNumber'] }
      ],
      order: [
        ['appointmentDate', 'ASC'],
        ['startTime', 'ASC']
      ],
      limit: 10
    });

    // Monthly revenue data for chart
    const monthlyRevenue = await getMonthlyRevenue(shopId);

    // Daily revenue for the last 30 days
    const dailyRevenue = await getDailyRevenue(shopId);

    // Booking statistics for chart
    const bookingStats = await getBookingStats(shopId);

    // Staff performance leaderboard
    const staffStats = await getStaffStats(shopId);

    res.json({
      todayBookings,
      todayRevenue,
      weeklyRevenue,
      upcomingAppointments,
      monthlyRevenue,
      dailyRevenue,
      bookingStats,
      staffStats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      message: 'Failed to get dashboard stats',
      error: error.message 
    });
  }
};

async function getMonthlyRevenue(shopId) {
  const months = [];
  const revenueData = [];
  
  for (let i = 5; i >= 0; i--) {
    const monthStart = moment.tz(EAT).subtract(i, 'months').startOf('month');
    const monthEnd = monthStart.clone().endOf('month');
    
    const revenue = await Payment.sum('amount', {
      where: {
        status: 'completed',
        createdAt: {
          [Op.between]: [monthStart.toDate(), monthEnd.toDate()]
        },
        '$Appointment.shopId$': shopId
      },
      include: [{
        model: Appointment,
        where: { shopId }
      }]
    }) || 0;

    months.push(monthStart.format('MMM YYYY'));
    revenueData.push(revenue);
  }

  return { months, revenueData };
}

async function getDailyRevenue(shopId) {
  const days = [];
  const revenueData = [];
  
  for (let i = 29; i >= 0; i--) {
    const dayStart = moment.tz(EAT).subtract(i, 'days').startOf('day');
    const dayEnd = dayStart.clone().endOf('day');
    
    const revenue = await Payment.sum('amount', {
      where: {
        status: 'completed',
        createdAt: {
          [Op.between]: [dayStart.toDate(), dayEnd.toDate()]
        },
        '$Appointment.shopId$': shopId
      },
      include: [{
        model: Appointment,
        where: { shopId }
      }]
    }) || 0;

    days.push(dayStart.format('DD MMM'));
    revenueData.push(revenue);
  }

  return { days, revenueData };
}

async function getStaffStats(shopId) {
  const staff = await Staff.findAll({
    where: { shopId },
    attributes: ['id', 'firstName', 'lastName', 'role', 'rating']
  });

  const stats = [];
  for (const member of staff) {
    const totalBookings = await Appointment.count({
      where: { staffId: member.id, status: 'completed' }
    });

    const totalRevenue = await Payment.sum('amount', {
      where: {
        status: 'completed',
        '$Appointment.staffId$': member.id
      },
      include: [{
        model: Appointment,
        where: { staffId: member.id }
      }]
    }) || 0;

    stats.push({
      id: member.id,
      name: `${member.firstName} ${member.lastName}`,
      role: member.role,
      bookings: totalBookings,
      revenue: totalRevenue,
      rating: member.rating || 5.0
    });
  }

  // Sort by revenue descending
  return stats.sort((a, b) => b.revenue - a.revenue);
}

async function getBookingStats(shopId) {
  const labels = ['Completed', 'Pending', 'Cancelled', 'No Show'];
  const data = [];

  for (const status of ['completed', 'pending', 'cancelled', 'no_show']) {
    const count = await Appointment.count({
      where: { shopId, status }
    });
    data.push(count);
  }

  return { labels, data };
}

exports.manageServices = async (req, res) => {
  try {
    const shopId = req.user.Shop.id;
    const { action } = req.params;
    const serviceData = req.body;

    switch (action) {
      case 'add':
        const service = await Service.create({
          ...serviceData,
          shopId,
          price: parseFloat(serviceData.price)
        });
        return res.status(201).json(service);

      case 'update':
        const [updated] = await Service.update(serviceData, {
          where: { id: serviceData.id, shopId }
        });
        if (!updated) {
          return res.status(404).json({ message: 'Service not found' });
        }
        const updatedService = await Service.findByPk(serviceData.id);
        return res.json(updatedService);

      case 'delete':
        const deleted = await Service.destroy({
          where: { id: serviceData.id, shopId }
        });
        if (!deleted) {
          return res.status(404).json({ message: 'Service not found' });
        }
        return res.json({ message: 'Service deleted successfully' });

      default:
        return res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    console.error('Manage services error:', error);
    res.status(500).json({ 
      message: 'Failed to manage services',
      error: error.message 
    });
  }
};

exports.getRevenueAnalytics = async (req, res) => {
  try {
    const shopId = req.user.Shop.id;
    const { period } = req.query;
    const monthlyRevenue = await getMonthlyRevenue(shopId);
    res.json({ period, analytics: monthlyRevenue });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch revenue analytics', error: error.message });
  }
};

exports.promoteShop = async (req, res) => {
  try {
    const shopId = req.user.Shop.id;
    const { plan } = req.body; // e.g., 'featured_30_days'

    const shop = await Shop.findByPk(shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    // Mock payment validation and upgrade
    shop.isFeatured = true;
    shop.featuredUntil = moment.tz(EAT).add(30, 'days').toDate();
    await shop.save();

    res.json({ 
      message: 'Promotion activated! Your shop is now featured for 30 days.',
      shop 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to promote shop', error: error.message });
  }
};
const { Appointment, Service, Staff, Shop, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment-timezone');

const EAT = 'Africa/Nairobi';

exports.createAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { shopId, serviceId, staffId, appointmentDate, startTime } = req.body;
    const clientId = req.user.id;

    const service = await Service.findByPk(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const startDateTime = moment.tz(`${appointmentDate} ${startTime}`, EAT);
    const endDateTime = startDateTime.clone().add(service.duration, 'minutes');

    const appointment = await Appointment.create({
      clientId, shopId, serviceId, staffId,
      appointmentDate: startDateTime.format('YYYY-MM-DD'),
      startTime: startDateTime.toDate(),
      endTime: endDateTime.toDate(),
      status: 'pending',
      price: service.price,
      duration: service.duration
    }, { transaction });

    await transaction.commit();
    res.status(201).json({ message: 'Appointment created successfully', appointment });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ message: 'Failed to create appointment', error: error.message });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { shopId, serviceId, staffId, date } = req.query;

    const shop = await Shop.findByPk(shopId);
    const service = await Service.findByPk(serviceId);
    if (!shop || !service) return res.status(404).json({ message: 'Shop or Service not found' });

    const dayOfWeek = moment.tz(date, EAT).format('dddd').toLowerCase();
    const shopHours = shop.openingHours[dayOfWeek];
    if (!shopHours) return res.json({ availableSlots: [] });

    const openTime = moment.tz(`${date} ${shopHours.open}`, EAT);
    const closeTime = moment.tz(`${date} ${shopHours.close}`, EAT);
    
    const slots = [];
    let currentSlot = openTime.clone();
    while (currentSlot.clone().add(service.duration, 'minutes') <= closeTime) {
      slots.push(currentSlot.format('HH:mm'));
      currentSlot.add(30, 'minutes');
    }

    const existingAppointments = await Appointment.findAll({
      where: { staffId, appointmentDate: date, status: { [Op.notIn]: ['cancelled'] } }
    });

    const availableSlots = slots.filter(slot => {
      const slotStart = moment.tz(`${date} ${slot}`, EAT);
      const slotEnd = slotStart.clone().add(service.duration, 'minutes');
      return !existingAppointments.some(apt => {
        const aptStart = moment(apt.startTime);
        const aptEnd = moment(apt.endTime);
        return (slotStart < aptEnd && slotEnd > aptStart);
      });
    });

    res.json({ availableSlots });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get slots', error: error.message });
  }
};

exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { clientId: req.user.id },
      include: [Service, Staff, Shop],
      order: [['startTime', 'DESC']]
    });
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      where: { id: req.params.id, clientId: req.user.id },
      include: [Service, Staff, Shop]
    });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointment', error: error.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      where: { id: req.params.id, clientId: req.user.id }
    });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    
    appointment.status = 'cancelled';
    await appointment.save();
    res.json({ message: 'Cancelled successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel', error: error.message });
  }
};

exports.getStaffAppointments = async (req, res) => {

  try {
    const { staffId } = req.params;
    const appointments = await Appointment.findAll({
      where: { staffId },
      include: [
        { model: Service, attributes: ['name', 'price', 'duration'] },
        { model: User, attributes: ['firstName', 'lastName', 'phoneNumber', 'profilePicture'] },
        { model: Shop, attributes: ['name', 'address'] }
      ],
      order: [['appointmentDate', 'ASC'], ['startTime', 'ASC']]
    });
    res.json({ appointments });
  } catch (error) {
    console.error('Fetch staff appointments error:', error);
    res.status(500).json({ message: 'Failed to fetch staff appointments', error: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Security: Only shop owner or staff of this shop should update
    const shop = await Shop.findOne({ where: { id: appointment.shopId, ownerId: req.user.id } });
    if (!shop && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: `Appointment status updated to ${status}`, appointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};
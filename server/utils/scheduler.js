const cron = require('node-cron');
const { Appointment, Shop, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment-timezone');
const axios = require('axios');

const EAT = 'Africa/Nairobi';

// Mock SMS Sender (Can be integrated with Africa's Talking or Twilio)
async function sendSMS(to, message) {
  console.log(`[SMS] Sending to ${to}: ${message}`);
  // Integration would go here:
  // await axios.post('https://api.africastalking.com/version1/messaging', ...)
  return true;
}

const initReminders = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('[Scheduler] Checking for upcoming appointments for reminders...');
    
    try {
      const targetTime = moment.tz(EAT).add(2, 'hours');
      const targetDate = targetTime.format('YYYY-MM-DD');
      const targetHour = targetTime.format('HH:00'); // Check at the start of the hour

      const upcomingApts = await Appointment.findAll({
        where: {
          appointmentDate: targetDate,
          startTime: { [Op.like]: `${targetHour}%` },
          status: 'confirmed',
          reminderSent: false
        },
        include: [
          { model: Shop, attributes: ['name', 'address'] },
          { model: User, attributes: ['firstName', 'phoneNumber'] }
        ]
      });

      console.log(`[Scheduler] Found ${upcomingApts.length} appointments for reminders.`);

      for (const apt of upcomingApts) {
        const message = `Hello ${apt.User.firstName}, reminder of your appointment at ${apt.Shop.name} today at ${apt.startTime}. Location: ${apt.Shop.address}. See you soon!`;
        
        await sendSMS(apt.User.phoneNumber, message);
        
        // Mark as sent
        apt.reminderSent = true;
        await apt.save();
      }
    } catch (error) {
      console.error('[Scheduler Error]:', error);
    }
  });
};

module.exports = { initReminders };

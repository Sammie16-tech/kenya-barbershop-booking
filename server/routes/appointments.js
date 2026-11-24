const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

router.get('/', protect, appointmentController.getUserAppointments);
router.get('/available-slots', appointmentController.getAvailableSlots);
router.post('/', protect, appointmentController.createAppointment);
router.get('/:id', protect, appointmentController.getAppointmentById);
router.put('/:id/cancel', protect, appointmentController.cancelAppointment);
router.get('/staff/:staffId', appointmentController.getStaffAppointments);


router.put('/:id/status', protect, appointmentController.updateAppointmentStatus);

module.exports = router;


const express = require('express');
const router = express.Router();
const {
    createBooking,
    updateBookingStatus,
    getBookings,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/').post(protect, createBooking).get(protect, getBookings);
router.route('/:id/status').put(protect, authorize('admin', 'provider'), updateBookingStatus);

module.exports = router;

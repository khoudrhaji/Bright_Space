const Booking = require('../models/Booking');
const Service = require('../models/Service');
const calculatePrice = require('../utils/calculatePrice');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    const { providerId, serviceId, bookingDate, options, couponCode } = req.body;

    try {
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        const totalPrice = await calculatePrice(service, options, couponCode);

        const booking = new Booking({
            user: req.user._id,
            provider: providerId,
            service: serviceId,
            bookingDate,
            totalPrice,
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin or Private/Provider
const updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (booking) {
            booking.status = req.body.status;
            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createBooking,
    updateBookingStatus,
    getBookings,
};

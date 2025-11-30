const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments({});
        const pendingBookings = await Booking.countDocuments({ status: 'Pending' });

        res.json({
            userCount,
            pendingBookings,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve a provider
// @route   PUT /api/admin/approve-provider/:id
// @access  Private/Admin
const approveProvider = async (req, res) => {
    try {
        const provider = await User.findById(req.params.id);

        if (provider && provider.role === 'provider') {
            provider.isApproved = true;
            const updatedProvider = await provider.save();
            res.json(updatedProvider);
        } else {
            res.status(404).json({ message: 'Provider not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    approveProvider,
};

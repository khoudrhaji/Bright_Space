const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    approveProvider,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/stats').get(protect, authorize('admin'), getDashboardStats);
router.route('/approve-provider/:id').put(protect, authorize('admin'), approveProvider);

module.exports = router;

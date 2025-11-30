const express = require('express');
const router = express.Router();
const {
    getProviders,
    updateUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/providers').get(getProviders);
router.route('/profile').put(protect, updateUserProfile);

module.exports = router;

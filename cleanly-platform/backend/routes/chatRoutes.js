const express = require('express');
const router = express.Router();
const {
    getConversations,
    sendMessage,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getConversations);
router.route('/send').post(protect, sendMessage);

module.exports = router;

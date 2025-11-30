const Conversation = require('../models/Conversation');

// @desc    Get conversations for a user
// @route   GET /api/chat
// @access  Private
const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ participants: req.user._id }).populate('participants', 'name');
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send a message
// @route   POST /api/chat/send
// @access  Private
const sendMessage = async (req, res) => {
    const { recipientId, text } = req.body;

    try {
        let conversation = await Conversation.findOne({
            participants: { $all: [req.user._id, recipientId] },
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [req.user._id, recipientId],
            });
        }

        const message = {
            sender: req.user._id,
            text,
        };

        conversation.messages.push(message);
        await conversation.save();

        res.status(201).json(conversation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getConversations,
    sendMessage,
};

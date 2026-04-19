const Message = require('../Models/Message');
const User = require('../Models/user');

const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find unique users that either sent or received messages to/from this user
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .sort({ createdAt: -1 })
        .populate('sender', 'name image shopName')
        .populate('receiver', 'name image shopName');


        const conversationsMap = new Map();
        
        messages.forEach(msg => {
            // Safety check: ensure both sender and receiver exist (in case one was deleted)
            if (!msg.sender || !msg.receiver) return;

            const otherUser = msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;
            
            // Ensure otherUser exists
            if (!otherUser) return;
            
            const otherUserId = otherUser._id.toString();

            if (!conversationsMap.has(otherUserId)) {
                conversationsMap.set(otherUserId, {
                    user: otherUser,
                    lastMessage: msg.message,
                    lastMessageTime: msg.createdAt,
                    unreadCount: (!msg.isRead && msg.receiver._id.toString() === userId.toString()) ? 1 : 0
                });
            } else if (!msg.isRead && msg.receiver._id.toString() === userId.toString()) {
                const conv = conversationsMap.get(otherUserId);
                conv.unreadCount += 1;
            }
        });


        res.status(200).json(Array.from(conversationsMap.values()));
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const userId = req.user._id;
        const { otherUserId } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId }
            ]
        })
        .sort({ createdAt: 1 })
        .populate('product', 'title image price');

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const { otherUserId } = req.params;

        await Message.updateMany(
            { sender: otherUserId, receiver: userId, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({ message: 'Messages marked as read' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id;
        const count = await Message.countDocuments({ 
            receiver: userId, 
            isRead: false 
        });
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    getConversations,
    getMessages,
    markAsRead,
    getUnreadCount
};


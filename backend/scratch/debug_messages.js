const mongoose = require('mongoose');
require('dotenv').config();
const Message = require('../Models/Message');
require('../Models/user'); // Ensure User model is registered for population


async function debugConversations() {
    await mongoose.connect(process.env.MONGO_CONN);
    console.log("Connected to MongoDB Atlas");

    const allMessages = await Message.find({}).populate('sender').populate('receiver');
    console.log(`Total messages in DB: ${allMessages.length}`);
    
    if (allMessages.length > 0) {
        console.log("--- Latest 5 Messages ---");
        allMessages.slice(-5).forEach(m => {
            console.log(`ID: ${m._id} | From: ${m.sender?._id} (${m.sender?.name || 'Unknown'}) | To: ${m.receiver?._id} (${m.receiver?.name || 'Unknown'}) | Msg: ${m.message}`);
        });
    } else {
        console.log("No messages found in DB.");
    }


    // Pick a user who has messages
    const testUser = allMessages[0]?.sender?._id;
    if (testUser) {
        console.log(`Testing getConversations logic for user: ${testUser}`);
        const userId = testUser;
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .sort({ createdAt: -1 })
        .populate('sender', 'name image shopName')
        .populate('receiver', 'name image shopName');

        const conversationsMap = new Map();
        messages.forEach(msg => {
            if (!msg.sender || !msg.receiver) {
                console.log("Skipping message with missing sender/receiver population");
                return;
            }
            const otherUser = msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;
            const otherUserId = otherUser._id.toString();

            if (!conversationsMap.has(otherUserId)) {
                conversationsMap.set(otherUserId, {
                    user: otherUser,
                    lastMessage: msg.message
                });
            }
        });
        console.log(`Found ${conversationsMap.size} conversations for user ${testUser}`);
        console.log(Array.from(conversationsMap.values()));
    }

    await mongoose.disconnect();
}

debugConversations().catch(console.error);

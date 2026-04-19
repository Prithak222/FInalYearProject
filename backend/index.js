const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const Message = require('./Models/Message');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');

require('./Models/db');



const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use('/auth', AuthRouter);
app.use("/api/products", require("./Routes/productRoutes"));
app.use("/api/cart", require("./Routes/cartRoutes"));
app.use("/api/wishlist", require("./Routes/wishlistRoutes"));
app.use("/api/orders", require("./Routes/orderRoutes"));
app.use("/api/categories", require("./Routes/categoryRoutes"));
app.use("/api/payments", require("./Routes/paymentRoutes"));
app.use("/api/messages", require("./Routes/messageRoutes"));
app.use("/api/payouts", require("./Routes/payoutRoutes"));
app.use("/api/reviews", require("./Routes/reviewRoutes"));

// Socket.IO Logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    socket.on('send_message', async (data) => {
        const { sender, receiver, message, product } = data;
        try {
            let newMessage = new Message({
                sender,
                receiver,
                message,
                product
            });
            await newMessage.save();
            
            // Populate product if it exists for richer UI update
            if (product) {
                newMessage = await Message.findById(newMessage._id).populate('product', 'title image price');
            }
            
            // Emit to receiver's room
            io.to(receiver.toString()).emit('receive_message', newMessage);
            // Also emit back to sender (good for multi-device sync)
            io.to(sender.toString()).emit('receive_message', newMessage);
            
        } catch (err) {
            console.error('Error saving message:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


server.listen(port, () => {
    console.log("Server is running on port " + port);
})
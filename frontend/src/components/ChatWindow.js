import React, { useState, useEffect, useRef } from 'react';
import { SendIcon, PackageIcon, MessageCircleIcon } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export function ChatWindow({ otherUser, productId }) {
    const socket = useSocket();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [product, setProduct] = useState(null);
    const scrollRef = useRef();

    useEffect(() => {
        if (!otherUser?._id) return;

        // Fetch message history
        const fetchHistory = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/messages/${otherUser._id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const data = await res.json();
                setMessages(data);
                
                // If there's a product context, extract it from the first message or fetch separately
                if (productId) {
                    const prodRes = await fetch(`http://localhost:5000/api/products/${productId}`);
                    const prodData = await prodRes.json();
                    setProduct(prodData);
                }
            } catch (err) {
                console.error('Failed to fetch history', err);
            }
        };

        fetchHistory();

        // Mark as read
        const markRead = async () => {
            await fetch(`http://localhost:5000/api/messages/read/${otherUser._id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${user.token}` }
            });
        };
        markRead();

    }, [otherUser?._id, productId, user?.token]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (msg) => {
            if (msg.sender === otherUser?._id || msg.receiver === otherUser?._id) {
                setMessages(prev => [...prev, msg]);
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        return () => socket.off('receive_message');
    }, [socket, otherUser?._id]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        const messageData = {
            sender: user._id,
            receiver: otherUser._id,
            message: newMessage,
            product: productId || null
        };

        socket.emit('send_message', messageData);
        setNewMessage('');
    };

    if (!otherUser) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                <MessageCircleIcon size={64} className="mb-4 opacity-20" />
                <p className="font-bold">Select a conversation to start chatting</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">
                        {otherUser.image ? (
                            <img src={otherUser.image} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            otherUser.name?.charAt(0)
                        )}
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900">{otherUser.name}</h3>
                        <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Online</p>
                    </div>
                </div>
            </div>

            {/* Product Context */}
            {product && (
                <div className="p-3 bg-slate-50 border-b flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-white border p-1">
                        <img src={product.image} className="w-full h-full object-cover rounded-md" alt="" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inquiry about</p>
                        <h4 className="text-xs font-bold text-slate-900">{product.title}</h4>
                    </div>
                    <p className="text-sm font-black text-primary">Rs. {product.price}</p>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f8fafc]">
                {messages.map((msg, idx) => {
                    const isMine = msg.sender.toString() === user._id.toString();
                    return (
                        <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-4 rounded-[1.5rem] shadow-sm ${
                                isMine 
                                ? 'bg-slate-900 text-white rounded-tr-none' 
                                : 'bg-white text-slate-900 rounded-tl-none border border-slate-100'
                            }`}>
                                <p className="text-sm font-medium">{msg.message}</p>
                                <p className={`text-[9px] mt-1 font-bold uppercase tracking-widest ${isMine ? 'text-white/40' : 'text-slate-400'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium text-sm"
                    />
                    <button 
                        type="submit"
                        className="p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <SendIcon size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}

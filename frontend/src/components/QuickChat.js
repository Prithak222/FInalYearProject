import React, { useState, useEffect, useRef } from 'react';
import { SendIcon, XIcon, MinusIcon, MessageCircleIcon, PackageIcon, ChevronUpIcon } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export function QuickChat({ otherUser, productId, onClose }) {
    const socket = useSocket();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [product, setProduct] = useState(null);
    const [isMinimized, setIsMinimized] = useState(false);
    const scrollRef = useRef();

    const API_BASE = 'http://localhost:5000/api';

    useEffect(() => {
        if (!otherUser?._id) return;

        // Fetch message history
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${API_BASE}/messages/${otherUser._id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const data = await res.json();
                setMessages(data);
                
                if (productId) {
                    const prodRes = await fetch(`${API_BASE}/products/${productId}`);
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
            await fetch(`${API_BASE}/messages/read/${otherUser._id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${user.token}` }
            });
        };
        markRead();

    }, [otherUser?._id, productId, user?.token]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (msg) => {
            if (msg.sender.toString() === otherUser?._id?.toString() || msg.receiver.toString() === otherUser?._id?.toString()) {
                setMessages(prev => [...prev, msg]);
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        return () => socket.off('receive_message');
    }, [socket, otherUser?._id]);

    useEffect(() => {
        if (!isMinimized) {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isMinimized]);

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

    if (isMinimized) {
        return (
            <div className="fixed bottom-6 right-6 z-[100]">
                <button 
                    onClick={() => setIsMinimized(false)}
                    className="flex items-center space-x-3 px-6 py-4 bg-slate-900 text-white rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                    <MessageCircleIcon size={20} className="text-primary" />
                    <span className="font-black text-xs uppercase tracking-widest">{otherUser.name}</span>
                    <ChevronUpIcon size={16} />
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-white rounded-[2.5rem] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-slate-100 z-[100] animate-in slide-in-from-bottom-10 duration-500 ease-out">
            {/* Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary overflow-hidden">
                        {otherUser.image ? (
                            <img src={otherUser.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                            otherUser.name?.charAt(0)
                        )}
                    </div>
                    <div>
                        <h3 className="font-black text-sm tracking-tight">{otherUser.name}</h3>
                        <div className="flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Live Chat</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-1">
                    <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <MinusIcon size={18} />
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-red-500/20 text-white rounded-xl transition-colors">
                        <XIcon size={18} />
                    </button>
                </div>
            </div>

            {/* Product Context */}
            {product && (
                <div className="p-3 bg-slate-50 border-b flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 overflow-hidden flex-shrink-0">
                        <img src={product.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Inquiry about</p>
                        <h4 className="text-[11px] font-bold text-slate-900 truncate">{product.title}</h4>
                    </div>
                    <p className="text-xs font-black text-primary">Rs.{product.price}</p>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-10">
                        <MessageCircleIcon size={48} className="mb-4 text-slate-300" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-10 leading-relaxed">
                            Starting a fresh conversation with {otherUser.name}
                        </p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMine = msg.sender.toString() === user._id.toString();
                        return (
                            <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-[1.2rem] shadow-sm ${
                                    isMine 
                                    ? 'bg-slate-900 text-white rounded-tr-none' 
                                    : 'bg-white text-slate-900 rounded-tl-none border border-slate-100'
                                }`}>
                                    <p className="text-xs font-medium leading-relaxed">{msg.message}</p>
                                    <p className={`text-[8px] mt-1 font-bold uppercase tracking-widest ${isMine ? 'text-white/40' : 'text-slate-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Say hello..."
                        className="flex-1 p-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-xs font-bold"
                    />
                    <button 
                        type="submit"
                        className="p-3.5 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <SendIcon size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}

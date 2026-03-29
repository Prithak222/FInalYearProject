import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { ChatWindow } from '../components/ChatWindow';
import { MessageCircleIcon, SearchIcon, ClockIcon } from 'lucide-react';

export function Messages({ isVendorPortal = false }) {
    const { user } = useAuth();
    const socket = useSocket();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    // Context from navigation (e.g. from ProductDetail)
    const initialOtherUserId = searchParams.get('user');
    const productId = searchParams.get('product');

    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_BASE = 'http://localhost:5000/api';

    const fetchConversations = async () => {
        try {
            const res = await fetch(`${API_BASE}/messages/conversations`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const data = await res.json();
            setConversations(data);
            
            // If we were sent here with a specific user, find them or create a temp entry
            if (initialOtherUserId) {
                const existing = data.find(c => c.user._id === initialOtherUserId);
                if (existing) {
                    setSelectedUser(existing.user);
                } else {
                    // Fetch user info to show in chat window
                    const userRes = await fetch(`http://localhost:5000/auth/user/${initialOtherUserId}`);
                    const userData = await userRes.json();
                    setSelectedUser(userData);
                }
            }
        } catch (err) {
            console.error('Failed to fetch conversations', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, [user.token, initialOtherUserId]);

    useEffect(() => {
        if (!socket) return;

        const handleIncoming = (msg) => {
            // Update conversations list in real-time
            setConversations(prev => {
                const otherId = msg.sender.toString() === user._id.toString() ? msg.receiver.toString() : msg.sender.toString();
                const existing = prev.find(c => c.user._id.toString() === otherId);
                
                if (existing) {
                    return prev.map(c => c.user._id.toString() === otherId ? {
                        ...c,
                        lastMessage: msg.message,
                        lastMessageTime: msg.createdAt,
                        unreadCount: (msg.sender.toString() !== user._id.toString() && selectedUser?._id?.toString() !== otherId) ? c.unreadCount + 1 : c.unreadCount
                    } : c).sort((a,b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
                } else {
                    // New conversation, re-fetch list to get user info
                    fetchConversations();
                    return prev; 
                }
            });
        };

        socket.on('receive_message', handleIncoming);
        return () => socket.off('receive_message');
    }, [socket, user._id, selectedUser?._id]);

    return (
        <div className={`${isVendorPortal ? 'h-[calc(100vh-0px)]' : 'min-h-screen'} bg-slate-50 flex overflow-hidden`}>
            {/* Sidebar */}
            <div className="w-80 md:w-96 bg-white border-r flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center mb-6">
                        <MessageCircleIcon className="mr-3 text-primary" size={28} />
                        Messages
                    </h1>
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search messages..." 
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium text-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {loading ? (
                        <div className="p-10 text-center space-y-4">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Chats...</p>
                        </div>
                    ) : conversations.length > 0 ? (
                        conversations.map((conv, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setSelectedUser(conv.user);
                                    // Clear unread count locally
                                    setConversations(prev => prev.map(c => c.user._id === conv.user._id ? { ...c, unreadCount: 0 } : c));
                                }}
                                className={`w-full p-4 flex items-center space-x-4 transition-all hover:bg-slate-50 border-l-4 ${
                                    selectedUser?._id === conv.user._id 
                                    ? 'bg-primary/5 border-primary shadow-sm' 
                                    : 'border-transparent'
                                }`}
                            >
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400 font-bold overflow-hidden shadow-sm border border-slate-100">
                                    {conv.user.image ? (
                                        <img src={conv.user.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        conv.user.name?.charAt(0)
                                    )}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-black text-slate-900 truncate uppercase text-xs tracking-wider">{conv.user.shopName || conv.user.name}</h3>
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center">
                                            <ClockIcon size={10} className="mr-1" />
                                            {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                                        </span>
                                    </div>
                                    <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-black text-slate-900' : 'text-slate-500 font-medium'}`}>
                                        {conv.lastMessage}
                                    </p>
                                </div>
                                {conv.unreadCount > 0 && (
                                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                        <span className="text-[10px] text-white font-black">{conv.unreadCount}</span>
                                    </div>
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="p-10 text-center space-y-4 opacity-40">
                            <MessageCircleIcon size={48} className="mx-auto text-slate-300" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No conversations yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col ${isVendorPortal ? 'h-full' : 'h-screen'} overflow-hidden`}>
                <ChatWindow 
                    otherUser={selectedUser} 
                    productId={productId} 
                />
            </div>
        </div>
    );
}

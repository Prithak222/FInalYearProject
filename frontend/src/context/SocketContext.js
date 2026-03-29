import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
    const { user, isLoggedIn } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (isLoggedIn && user?._id) {
            const newSocket = io('http://localhost:5000');
            setSocket(newSocket);

            newSocket.emit('join', user._id);
            console.log('Socket joined room:', user._id);

            return () => newSocket.close();
        }
    }, [isLoggedIn, user?._id]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}

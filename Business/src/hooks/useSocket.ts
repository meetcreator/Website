"use client";

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useSocket(onEvent?: (event: string, data: any) => void) {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socket = io(SOCKET_URL, {
            withCredentials: true,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        socket.onAny((event, ...args) => {
            if (onEvent) {
                onEvent(event, args[0]);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return socketRef.current;
}

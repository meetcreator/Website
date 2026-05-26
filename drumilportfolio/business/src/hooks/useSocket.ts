"use client";

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

import { API_BASE_URL } from '@/lib/api';

const SOCKET_URL = API_BASE_URL;

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

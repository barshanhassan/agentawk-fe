import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (workspaceId: string | number | bigint | undefined) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!workspaceId) return;

    // Use relative path since we proxied it in vite.config.ts
    const socket = io();
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      socket.emit('joinWorkspace', workspaceId.toString());
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [workspaceId]);

  return socketRef.current;
};

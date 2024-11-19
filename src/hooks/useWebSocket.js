// useWebSocket.js
import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const useWebSocket = (userId, onMessageReceived) => {
    const clientRef = useRef(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;

        const connect = () => {
            if (!userId) {
                console.warn("ws connection aborted: Missing userId");
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                console.warn("ws connection aborted: Missing token");
                return;
            }

            const socket = new SockJS('http://localhost:8080/ws');
            const client = new Client({
                webSocketFactory: () => socket,
                connectHeaders: { Authorization: `Bearer ${token}` },
                debug: console.log,
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => {
                    if (!mountedRef.current) return;
                    console.log("ws connected. Subscribing to notifications...");

                    client.subscribe(`/user/${userId}/queue/notifications`, (message) => {
                        console.log("Received notification message:", message.body);
                        const notification = JSON.parse(message.body);
                        onMessageReceived(notification);
                    });
                    client.subscribe(`/topic/notifications`, (message) => {
                        console.log("Received public notification message:", message.body);
                        const notification = JSON.parse(message.body);
                        onMessageReceived(notification);
                    });

                },
                onStompError: (frame) => {
                    console.error("ws STOMP error:", frame);
                },
            });

            clientRef.current = client;
            client.activate();
        };

        connect();

        return () => {
            mountedRef.current = false;
            clientRef.current?.deactivate();
        };
    }, [userId, onMessageReceived]);
};

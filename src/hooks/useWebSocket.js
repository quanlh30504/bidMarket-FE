// useWebSocket.js
import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const useWebSocket = (userId, onMessageReceived, onChatMessageReceived) => {
    const clientRef = useRef(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;

        const connect = () => {
            if (!userId) {
                console.warn("ws connection aborted: Missing userId");
                return;
            }
            console.log("[WebSocket] Connected successfully. User:", userId);

            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.warn("ws connection aborted: Missing token");
                return;
            }

            const socket = new SockJS('http://localhost:8080/ws');
            const client = new Client({
                webSocketFactory: () => socket,
                connectHeaders: {
                    Authorization: `Bearer ${token}`,
                    'userId': userId
                },
                debug: console.log,
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => {
                    if (!mountedRef.current) return;
                    console.log("ws connected. Subscribing to notifications...");

                    // client.subscribe(`/user/queue/notifications`, (message) => {
                    //     console.log("Received notification message:", message.body);
                    //     const notification = JSON.parse(message.body);
                    //     onMessageReceived(notification);
                    // });
                    // client.subscribe(`/topic/notifications`, (message) => {
                    //     console.log("Received public notification message:", message.body);
                    //     const notification = JSON.parse(message.body);
                    //     onMessageReceived(notification);
                    // });

                    // client.subscribe(`/user/queue/messages`, (message) => {
                    //     console.log("Received private chat message:", message.body);
                    //     const chatMessage = JSON.parse(message.body);
                    //     onChatMessageReceived(chatMessage);
                    // });
                    // Subscribe to notifications
                    client.subscribe('/user/queue/notifications', (message) => {
                        try {
                            console.log("[WebSocket] Notification received:", message.body);
                            const notification = JSON.parse(message.body);
                            onMessageReceived(notification);
                        } catch (error) {
                            console.error("[WebSocket] Failed to process notification:", error);
                        }
                    });

                    // Subscribe to messages
                    client.subscribe('/user/queue/messages', (message) => {
                        try {
                            console.log("[WebSocket] Chat message received:", message.body);
                            const chatMessage = JSON.parse(message.body);
                            onChatMessageReceived(chatMessage);
                        } catch (error) {
                            console.error("[WebSocket] Failed to process message:", error);
                        }
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
    }, [userId, onMessageReceived, onChatMessageReceived]);
};

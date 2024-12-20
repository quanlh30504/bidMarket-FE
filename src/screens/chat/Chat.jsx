import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import Conversation from './Conversation';
import Messages from './Messages';
import { chatService } from "../../services/chatService";
import { authUtils } from "../../utils/authUtils";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useSearchParams } from 'react-router-dom';
   
export const Chat = () => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [searchParams] = useSearchParams();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const currentUserId = authUtils.getCurrentUserId();
    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleNotification = useCallback((notification) => {
        console.log('[Chat] Received notification:', notification);
    }, []);

    const fetchRooms = useCallback(async () => {
        try {
            setLoading(true);
            const response = await chatService.getRooms();
            const sortedRooms = response.sort((a, b) => {
                const timeA = new Date(a.lastMessage?.timestamp || 0);
                const timeB = new Date(b.lastMessage?.timestamp || 0);
                return timeB - timeA;
            });
            setRooms(sortedRooms);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleNewMessage = useCallback((message) => {
        if (!message) return;

        console.log('Received message:', message);

        const roomId = message.chatRoomId || message.chatRoom?.id;
        if (!roomId) {
            console.warn('No room ID found in message:', message);
            return;
        }

        if (selectedRoom && roomId === selectedRoom.id) {
            setMessages(prev => {
                const isDuplicate = prev.some(m => m.id === message.id);
                if (isDuplicate) return prev;
                return [...prev, message];
            });
            scrollToBottom();
        }

        setRooms(prevRooms => {
            const updatedRooms = [...prevRooms];
            const roomIndex = updatedRooms.findIndex(r => r.id === roomId);

            if (roomIndex !== -1) {
                const updatedRoom = {
                    ...updatedRooms[roomIndex],
                    lastMessage: {
                        id: message.id,
                        content: message.content,
                        timestamp: message.timestamp,
                        type: message.type,
                        fileUrl: message.fileUrl,
                        sender: message.sender
                    }
                };

                updatedRooms.splice(roomIndex, 1);
                updatedRooms.unshift(updatedRoom);
            } else {
                fetchRooms();
            }

            return updatedRooms;
        });
    }, [selectedRoom, scrollToBottom, fetchRooms]);

    useEffect(() => {
        const roomId = searchParams.get('roomId');
        if (roomId && rooms.length > 0) {
            const room = rooms.find(r => r.id === roomId);
            if (room) {
                setSelectedRoom(room);
            }
        }
    }, [searchParams, rooms]);
    
    useEffect(() => {
        if (!selectedRoom || !stompClientRef.current) return;

        const subscription = stompClientRef.current.subscribe(
            `/topic/room.${selectedRoom.id}`,
            (message) => {
                try {
                    const chatMessage = JSON.parse(message.body);
                    handleNewMessage(chatMessage);
                } catch (error) {
                    console.error('Error processing room message:', error);
                }
            }
        );

        return () => {
            if (subscription) {
                try {
                    subscription.unsubscribe();
                } catch (error) {
                    console.error('[Chat] Error unsubscribing:', error);
                }
            }
        };
    }, [selectedRoom, handleNewMessage]);



    const handleSelectRoom = useCallback((room) => {
        if (selectedRoom?.id !== room.id) {
            setSelectedRoom(room);
            setMessages([]);
        }
    }, [selectedRoom?.id]);

    const handleChatClick = async (otherUserId) => {
        try {
            const room = await chatService.getOrCreateRoom(otherUserId);
        } catch (error) {
            console.error('Error sending room:', error);
        }
    }

    const handleDeleteRoom = useCallback(async (roomId) => {
        try {
            await chatService.deleteRoom(roomId);
            setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));

        } catch (error) {
            console.error('Error deleting room:', error);
        }
    })
    const wsClient = useWebSocket(
        currentUserId,
        handleNotification,
        handleNewMessage
    );
    stompClientRef.current = wsClient;

    useEffect(() => {
        if (currentUserId) {
            fetchRooms();
        }
    }, [currentUserId, fetchRooms]);

    return (
        <div className="h-[calc(100vh-32px)] bg-gray-50 px-4 pt-24">
            <div className="h-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex h-full">
                    <div className="w-80 border-r bg-white">
                        <Conversation
                            rooms={rooms}
                            loading={loading}
                            onSelectRoom={handleSelectRoom}
                            selectedRoomId={selectedRoom?.id}
                            onDeleteRoom={handleDeleteRoom}
                        />
                    </div>
                    <div className="flex-1">
                        <Messages
                            selectedRoom={selectedRoom}
                            onNewMessage={handleNewMessage}
                            currentUserId={currentUserId}
                            messages={messages}
                            setMessages={setMessages}
                            messagesEndRef={messagesEndRef}
                        />
                    </div>
                </div>
            </div>
            <button onClick={() => handleChatClick('5a7914d9-ea07-4930-80cb-4623f5c9c900')}>
                chat with '5a7914d9-ea07-4930-80cb-4623f5c9c900'
            </button>
        </div>
    );
};
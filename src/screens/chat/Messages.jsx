import React, { useState, useRef, useEffect } from 'react';
import { ImageIcon, SendHorizontal, FileText, Phone, Video, MoreVertical } from 'lucide-react';
import { chatService } from '../../services/chatService';
import MessageBubble from './MessageBubble';
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Messages = ({
                      selectedRoom,
                      onNewMessage,
                      currentUserId,
                      messages,
                      setMessages,
                      messagesEndRef
                  }) => {
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);
    const PAGE_SIZE = 20;

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        if (isAtBottom && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isAtBottom]);

    // Focus input when room changes
    useEffect(() => {
        if (selectedRoom && inputRef.current) {
            inputRef.current.focus();
            setPage(0);
            setHasMore(true);
        }
    }, [selectedRoom]);

    useEffect(() => {
        const updateMessageStatus = async () => {
            if (!selectedRoom || !messages.length) return;

            try {
                const unreadMessages = messages.filter(msg =>
                    msg.sender.id !== currentUserId &&
                    msg.status !== 'READ'
                );

                if (unreadMessages.length > 0) {
                    await chatService.markMessagesAsRead(selectedRoom.id, unreadMessages);

                    // Update local messages state
                    setMessages(prev => prev.map(msg =>
                        unreadMessages.some(unread => unread.id === msg.id)
                            ? { ...msg, status: 'READ' }
                            : msg
                    ));
                }
            } catch (error) {
                console.error('Error updating message status:', error);
            }
        };

        updateMessageStatus();
    }, [selectedRoom?.id, messages, currentUserId]);

    const handleScroll = async () => {
        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
            const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
            setIsAtBottom(isBottom);

            // Load more messages when scrolling to top
            if (scrollTop === 0 && hasMore && !loadingMore && messages.length > 0) {
                await loadMoreMessages();
            }
        }
    };

    const loadMoreMessages = async () => {
        if (!selectedRoom || loadingMore) return;

        try {
            setLoadingMore(true);
            const nextPage = page + 1;
            const timestamp = messages[0]?.timestamp;

            const response = await chatService.getMessages(selectedRoom.id, nextPage, PAGE_SIZE);
            const newMessages = response?.content || [];

            if (newMessages.length > 0) {
                setMessages(prev => [...newMessages.reverse(), ...prev]);
                setPage(nextPage);
            } else {
                setHasMore(false);
            }

            // Maintain scroll position
            if (messagesContainerRef.current && messages.length > 0) {
                const firstMessage = document.getElementById(messages[0].id);
                if (firstMessage) {
                    firstMessage.scrollIntoView();
                }
            }
        } catch (error) {
            console.error('Error loading more messages:', error);
        } finally {
            setLoadingMore(false);
        }
    };



    const loadInitialMessages = async () => {
        if (!selectedRoom) return;
        try {
            setLoading(true);
            const data = await chatService.getMessages(selectedRoom.id, 0, PAGE_SIZE);
            if (data?.content) {
                setMessages([...data.content].reverse());
                setHasMore(data.content.length === PAGE_SIZE);
            }
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                setIsAtBottom(true);
            }, 100);
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedRoom?.id) {
            loadInitialMessages();
        }
    }, [selectedRoom?.id]);

    const sendMessage = async () => {
        if (!selectedRoom || !inputValue.trim()) return;

        try {
            setLoading(true);
            const message = {
                content: inputValue.trim(),
                type: 'TEXT'
            };
            const newMessage = await chatService.sendMessage(selectedRoom.id, message);
            if (newMessage) {
                setMessages(prev => [...prev, newMessage]);
                onNewMessage(newMessage);
                setInputValue('');
                setIsAtBottom(true);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await sendMessage();
    };

    const handleKeyPress = async (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            await sendMessage();
        }
    };

    const handleFileSelect = async (event, type) => {
        const file = event.target.files?.[0];
        if (!file || !selectedRoom) return;

        try {
            setLoading(true);
            const newMessage = await chatService.sendFileMessage(selectedRoom.id, { file, type });
            if (newMessage) {
                setMessages(prev => [...prev, newMessage]);
                onNewMessage(newMessage);
                setIsAtBottom(true);
            }
            event.target.value = '';
        } catch (error) {
            console.error('Error sending file:', error);
        } finally {
            setLoading(false);
        }
    };

    const getOtherParticipant = (room) => {
        if (!room) return null;
        return room.user1.id === currentUserId ? room.user2 : room.user1;
    };

    if (!selectedRoom) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700">Welcome to Messages</h3>
                    <p className="text-sm text-gray-500 mt-1">Select a conversation to start chatting</p>
                </div>
            </div>
        );
    }

    const otherParticipant = getOtherParticipant(selectedRoom);

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="px-4 py-3 border-b flex items-center justify-between bg-white shadow-sm">
                <div className="flex items-center space-x-3">
                    <img
                        src={otherParticipant?.profile?.avatarUrl || "/default-avatar.png"}
                        alt={otherParticipant?.profile?.name || otherParticipant?.email || "User"}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            {otherParticipant?.profile?.name || otherParticipant?.email || "User"}
                        </h2>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                        <Phone className="h-4 w-4 text-gray-500"/>
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                        <Video className="h-4 w-4 text-gray-500"/>
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                        <MoreVertical className="h-4 w-4 text-gray-500"/>
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-6 py-5 bg-gray-50"
            >
                {loadingMore && (
                    <div className="absolute top-0 left-0 right-0 flex justify-center py-4 bg-gray-50/80">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                            <LoadingSpinner size="h-4 w-4"/>
                            <span className="text-sm text-gray-600">Loading messages...</span>
                        </div>
                    </div>
                )}

                {loading && messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message, index) => {
                            const messageKey = `${message.id}-${index}`;
                            const previousMessage = index > 0 ? messages[index - 1] : null;
                            const isConsecutive = previousMessage &&
                                previousMessage.sender.id === message.sender.id &&
                                (new Date(message.timestamp) - new Date(previousMessage.timestamp)) < 300000;

                            return (
                                <MessageBubble
                                    key={messageKey}
                                    id={message.id}
                                    message={message}
                                    isConsecutive={isConsecutive}
                                    currentUserId={currentUserId}
                                />
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="px-6 py-4 bg-white border-t">
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                    <input
                        type="file"
                        ref={imageInputRef}
                        onChange={e => handleFileSelect(e, 'IMAGE')}
                        className="hidden"
                        accept="image/*"
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={e => handleFileSelect(e, 'FILE')}
                        className="hidden"
                    />

                    <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={loading}
                        className="p-2 text-gray-500 hover:bg-gray-50
                        rounded-full transition-colors disabled:opacity-50"
                    >
                        <ImageIcon className="h-5 w-5"/>
                    </button>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="p-2 text-gray-500 hover:bg-gray-50
                        rounded-full transition-colors disabled:opacity-50"
                    >
                        <FileText className="h-5 w-5"/>
                    </button>

                    <input
                        ref={inputRef}
                        className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm
                        focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white
                        placeholder-gray-400 transition-colors disabled:opacity-50"
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                        placeholder="Type your message..."
                    />

                    <button
                        type="button"
                        onClick={sendMessage}
                        disabled={loading || !inputValue.trim()}
                        className={`p-2 rounded-full transition-colors
                            ${loading || !inputValue.trim()
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-50'
                        } disabled:opacity-50`}
                    >
                        <SendHorizontal className="h-5 w-5"/>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Messages;
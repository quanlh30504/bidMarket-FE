import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Archive, Trash2 } from 'lucide-react';
import { authUtils } from "../../utils/authUtils";
import {chatService} from "../../services/chatService";

const ConversationItem = ({ room, isActive, onSelect, onDelete }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const currentUserId = authUtils.getCurrentUserId();

    const getTimeString = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const getLastMessagePreview = (message) => {
        if (!message) return 'No messages yet';
        if (message.type === 'IMAGE') return '📷 Photo';
        if (message.type === 'FILE') return 'File';
        return message.content;
    };

    const getOtherParticipant = () => {
        return room.user1.id === currentUserId ? room.user2 : room.user1;
    };

    const isUnreadMessage = () => {
        const lastMessage = room.lastMessage;
        if (!lastMessage) return false;
        return lastMessage.sender.id !== currentUserId && lastMessage.status !== "READ";
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMoreClick = (e) => {
        e.stopPropagation();
        setShowDropdown(!showDropdown);
    };

    const handleAction = (action, e) => {
        e.stopPropagation();
        console.log(`${action} conversation:`, room.id);
        setShowDropdown(false);
    };

    const otherParticipant = getOtherParticipant();
    const unread = isUnreadMessage();

    const handleDeleteRoom = async (e) => {
        try {
            await onDelete(room.id);
            setShowDropdown(false);
        } catch (error) {
            console.error('Error deleting conversation:', error);
        }
    };

    return (
        <div
            onClick={() => onSelect(room)}
            className={`group px-4 py-2 hover:bg-gray-100 cursor-pointer transition-all duration-200 relative
                ${isActive ? 'bg-gray-100' : ''}
                ${unread ? 'bg-gray-50' : ''}`}
        >
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <img
                        src={otherParticipant.profile?.avatarUrl || "/default-avatar.png"}
                        alt={otherParticipant.profile?.name || otherParticipant.email}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"/>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h2 className={`text-[15px] ${unread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'} truncate`}>
                            {otherParticipant.profile?.name || otherParticipant.email}
                        </h2>
                        <div className="flex items-center space-x-2">
                            <span className={`text-[11px] whitespace-nowrap ${unread ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                                {getTimeString(room.lastMessage?.timestamp)}
                            </span>
                            {unread && (
                                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full flex-shrink-0" />
                            )}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={handleMoreClick}
                                    className="p-1 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MoreVertical className="h-4 w-4 text-gray-500" />
                                </button>
                                {showDropdown && (
                                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 border">
                                        <div className="py-1">
                                            <button
                                                onClick={(e) => handleAction('archive', e)}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                            >
                                                <Archive className="h-4 w-4 mr-2" />
                                                Archive
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteRoom()}
                                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete Conversation
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <p className={`text-[13px] truncate max-w-[180px] ${
                        unread ? 'text-gray-900 font-medium' : 'text-gray-500'
                    }`}>
                        {getLastMessagePreview(room.lastMessage)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConversationItem;
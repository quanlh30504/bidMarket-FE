import React, { useState } from 'react';
import { Search, Menu } from 'lucide-react';
import ConversationItem from './ConversationItem';

const Conversation = ({ rooms, loading, onSelectRoom, selectedRoomId, onDeleteRoom }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRooms = searchQuery
        ? rooms.filter(room =>
            room.user2.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (room.lastMessage?.content || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
        : rooms;

    return (
        <div className="flex flex-col h-full">
            <div className="flex-none p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-gray-800">Messages</h1>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Menu className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="text-center p-4 text-gray-500">
                        {searchQuery ? 'No conversations found' : 'No recent chats'}
                    </div>
                ) : (
                    filteredRooms.map(room => (
                        <ConversationItem
                            key={room.id}
                            room={room}
                            isActive={selectedRoomId === room.id}
                            onSelect={onSelectRoom}
                            onDelete={onDeleteRoom}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Conversation;
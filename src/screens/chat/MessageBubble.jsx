import React from 'react';
import { FileText } from 'lucide-react';

const MessageBubble = ({ message, isConsecutive, currentUserId }) => {
    const isSentByMe = message.sender.id === currentUserId;
    const isImage = message.type === 'IMAGE';
    const isFile = message.type === 'FILE';

    const handleFileClick = () => {
        if (message.fileUrl) {
            window.open(message.fileUrl, '_blank');
        }
    };

    return (
        <div className={`flex items-start gap-3 px-4 
                        ${isSentByMe ? 'justify-end' : 'justify-start'} 
                        ${isConsecutive ? 'mt-1' : 'mt-4'}`}>

            <div className={`flex-shrink-0 w-8 ${isSentByMe ? 'order-2 ml-2' : 'mr-2'}`}>
                {!isConsecutive && !isSentByMe && (
                    <div className="flex flex-col items-center">
                        <img
                            src={message.sender.profile?.avatarUrl || "/default-avatar.png"}
                            alt="avatar"
                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                            loading="lazy"
                        />
                    </div>
                )}
            </div>

            {/* Message Content Container */}
            <div className={`flex flex-col ${isSentByMe ? 'items-end' : 'items-start'} 
                           max-w-[65%] min-w-[100px]`}>
                {/* Sender Name */}
                {!isConsecutive && !isSentByMe && (
                    <span className="text-xs text-gray-500 mb-1 ml-1 font-medium line-clamp-1">
                        {message.sender.profile?.name || message.sender.email}
                    </span>
                )}

                {/* Message Content */}
                <div className={`rounded-2xl overflow-hidden w-fit
                    ${isImage ? 'p-0 max-w-md bg-transparent' : 'p-3'} 
                    ${isSentByMe
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'}`}>
                    {isImage ? (
                        <div className="relative group">
                            <img
                                src={message.fileUrl}
                                alt="attachment"
                                className="w-full h-full object-cover rounded-2xl max-h-64 cursor-pointer
                                         transition-transform duration-200 hover:scale-[0.98]"
                                onClick={() => window.open(message.fileUrl, '_blank')}
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5
                                          transition-colors duration-200 rounded-2xl" />
                        </div>
                    ) : isFile ? (
                        <div
                            onClick={handleFileClick}
                            className={`flex items-center gap-2 cursor-pointer group max-w-xs
                                      transition-colors duration-200
                                      ${isSentByMe ? 'hover:text-blue-50' : 'hover:text-gray-600'}`}
                        >
                            <FileText className="h-4 w-4 shrink-0" />
                            <span className="text-sm group-hover:underline line-clamp-1 break-all">
                                {message.content}
                            </span>
                        </div>
                    ) : (
                        <div className="text-[15px] break-words whitespace-pre-wrap max-w-prose">
                            {message.content}
                        </div>
                    )}
                </div>

                {/* Timestamp */}
                <span className={`text-[11px] text-gray-400 mt-1 px-1
                                ${isSentByMe ? 'mr-1' : 'ml-1'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
            </div>
        </div>
    );
};

export default MessageBubble;
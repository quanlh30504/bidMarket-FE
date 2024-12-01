import React, {useEffect, useRef} from 'react';
import { ImageIcon, SendHorizontal, FileText } from 'lucide-react';

const MessageInput = ({ loading, inputValue, setInputValue, onSubmit, onFileSelect }) => {
    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };


    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };

    return (
        <div className="px-6 py-4 bg-white border-t">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <input
                    type="file"
                    ref={imageInputRef}
                    onChange={(e) => onFileSelect(e, 'IMAGE')}
                    className="hidden"
                    accept="image/*"
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => onFileSelect(e, 'FILE')}
                    className="hidden"
                />

                <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={loading}
                    className="p-2.5 text-gray-500 hover:text-emerald-500 hover:bg-emerald-50
                        rounded-full transition-colors disabled:opacity-50"
                >
                    <ImageIcon className="h-5 w-5" />
                </button>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="p-2.5 text-gray-500 hover:text-emerald-500 hover:bg-emerald-50
                        rounded-full transition-colors disabled:opacity-50"
                >
                    <FileText className="h-5 w-5" />
                </button>

                <input
                    ref={inputRef}
                    className="flex-1 px-5 py-3 bg-gray-100 rounded-full text-sm
                        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white
                        placeholder-gray-400 transition-colors disabled:opacity-50"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    placeholder="Type your message..."
                />

                <button
                    type="submit"
                    disabled={loading || !inputValue.trim()}
                    className={`p-2.5 rounded-full transition-colors 
                        ${loading || !inputValue.trim()
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-emerald-500 hover:bg-emerald-50'
                    } disabled:opacity-50`}
                >
                    <SendHorizontal className="h-5 w-5" />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
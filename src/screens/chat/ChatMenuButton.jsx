import React, { useState } from 'react';

const ChatMenuButton = ({ onEdit, onDelete, isMessageType }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button 
        onClick={toggleMenu}
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        •••
      </button>
      {isOpen && (
        <div className={`absolute ${isMessageType ? 'right-0' : 'left-0'} mt-1 py-2 w-32 bg-white rounded-md shadow-xl z-20`}>
          <button
            onClick={() => { onEdit(); setIsOpen(false); }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Sửa
          </button>
          <button
            onClick={() => { onDelete(); setIsOpen(false); }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Xóa
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatMenuButton;
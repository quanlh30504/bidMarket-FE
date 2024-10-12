import React from 'react'
import { useState } from 'react';
import ChatMenuButton from './ChatMenuButton';

const Messages = () => {
    const [messages, setMessages] = useState([
        { type: 'message', message: 'Hello, how are you?' },
        { type: 'answer', message: 'I am good, thanks for asking!' },
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputValue.trim() === '') return;
        setMessages([...messages, { type: 'answer', message: inputValue.trim() }]);
        setInputValue('');
    };

    // useEffect(() => {
    //     // Hàm gọi API để lấy dữ liệu tin nhắn (nếu cần)
    //     const fetchMessages = async () => {
    //         try {
    //             const response = await axios.get('/api/messages'); // Thay đổi URL theo API của bạn
    //             setMessages(response.data); // Giả sử response.data là mảng tin nhắn
    //         } catch (error) {
    //             console.error("Error fetching messages:", error);
    //         }
    //     };

    //     fetchMessages(); // Gọi API khi component được mount
    // }, []);


  const handleEdit = () => {
    console.log('Edit user message');
    // Thêm logic để sửa tin nhắn
  };

  const handleDelete = () => {
    console.log('Delete user message');
    // Thêm logic để xóa tin nhắn
  };
    return (
        <div className="flex-grow h-[calc(100vh-88px)] flex flex-col">
            <div className="w-full h-15 bg-white shadow-md">
                <div className="flex p-2 align-middle items-center">
                    <div className="p-2 md:hidden rounded-full mr-1 hover:bg-purple-500 text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </div>
                    <div className="border rounded-full border-black p-1/2 mt-2">
                        <img className="w-14 h-14 rounded-full" src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png" alt="avatar"/>
                    </div>
                    <div className="flex-grow p-2">
                        <div className="text-md text-black-50 font-semibold">User 1 </div>
                        <div className="flex items-center">
                            {/* <div className="w-2 h-2 bg-green-300 rounded-full"></div> */}
                            <div className="text-xs text-black-50 ml-1">
                            Seller
                            </div>
                        </div>
                    </div>
                    <div className="p-2 text-black cursor-pointer hover:bg-emerald-500 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="w-full flex-grow bg-gray-100 dark:bg-gray-900 my-2 p-2 overflow-y-auto">
      {messages.map((message, index) => (
        <div key={index} className={`flex ${message.type === 'message' ? 'justify-start' : 'justify-end'}`}>
            {message.type === 'message' && (
            <img className=" w-8 h-8 m-3 rounded-full" src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png" alt="avatar"/>
          )}
          <div className="relative flex items-center">
            {message.type !== 'message' && (
              <ChatMenuButton 
                onEdit={() => handleEdit(message.id)}
                onDelete={() => handleDelete(message.id)}
                isMessageType={false}
              />
            )}
            <div className={`p-3 ${message.type === 'message' ? 'bg-gray-300  mx-3 my-1 rounded-2xl rounded-bl-none' : 'bg-emerald-500 m-1 rounded-xl rounded-br-none'} sm:max-w-md`}>
              <div className={`text-${message.type === 'message' ? 'gray-700 ' : 'white'}`}>
                {message.message}
              </div>
              <div className="text-xs text-white">1 day ago</div>
            </div>
            {message.type === 'message' && (
              <ChatMenuButton 
                onEdit={() => handleEdit(message.id)}
                onDelete={() => handleDelete(message.id)}
                isMessageType={true}
              />
            )}
          </div>
        </div>
      ))}
    </div>
            <div className="h-15  p-3 rounded-xl rounded-tr-none rounded-tl-none bg-gray-100 dark:bg-gray-800">
                <form onSubmit={handleSubmit}className="flex items-center">
                    <div className="p-2 text-gray-600 dark:text-gray-200 ">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="search-chat flex flex-grow p-2">
                        <input className="input text-gray-700 dark:text-gray-200 text-sm p-5 focus:outline-none bg-gray-100 da rk:bg-gray-800  flex-grow rounded-l-md" type="text" value={inputValue}
          onChange={handleInputChange} placeholder="Type your message ..."/>
                        <button type="submit" className="bg-gray-100 dark:bg-gray-800 dark:text-gray-200  flex justify-center items-center pr-3 text-gray-400 rounded-r-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Messages
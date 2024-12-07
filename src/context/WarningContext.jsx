import React, { createContext, useContext, useState } from 'react';

const WarningContext = createContext();

export const WarningProvider = ({ children }) => {
  const [warning, setWarning] = useState({
    isVisible: false,
    content: null, // Component được hiển thị trong modal
    onConfirm: null,
  });

  const showWarning = (content, onConfirm) => {
    setWarning({ isVisible: true, content, onConfirm });
  };

  const hideWarning = () => {
    setWarning({ isVisible: false, content: null, onConfirm: null });
  };

  return (
    <WarningContext.Provider value={{ warning, showWarning, hideWarning }}>
      {children}
      {warning.isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-3 w-1/3">
            <div className="mb-4">{warning.content}</div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-4 rounded-full"
                onClick={hideWarning}
              >
                Cancel
              </button>
              {warning.onConfirm && (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded-full"
                  onClick={async () => {
                    try {
                      await warning.onConfirm(); // Chờ onConfirm hoàn thành
                    } catch (error) {
                      console.error('Error in onConfirm:', error);
                    } finally {
                      hideWarning(); // Ẩn modal sau khi onConfirm hoàn thành
                    }
                  }}
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </WarningContext.Provider>
  );
};


export const useWarning = () => useContext(WarningContext);

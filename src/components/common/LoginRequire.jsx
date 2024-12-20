
export const LoginRequire = ({ onClose, onLogin, content}) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-80">
          <h2 className="text-lg font-semibold mb-4">You need to log in
  </h2>
          <p className="text-sm text-gray-700 mb-6">
            {content}
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="text-gray-600 bg-gray-200 hover:bg-gray-300 font-medium py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              onClick={onLogin}
              className="text-white bg-green hover:bg-blue-600 font-medium py-2 px-4 rounded"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  };
  
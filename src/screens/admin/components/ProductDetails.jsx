import React, { useState } from 'react';
import { CategoryType } from '../../../router';

export const ProductDetails = ({ productDetails, setProductDetails, disabled = false }) => {
  const [showCategories, setShowCategories] = useState(false); // show list of categories for choosing

  const handleTitleChange = (e) => {
    if (disabled) return; // Vô hiệu hóa nếu disabled
    setProductDetails({ ...productDetails, title: e.target.value });
  };

  const toggleCategory = (category) => {
    if (disabled) return; // Vô hiệu hóa nếu disabled
    let updatedCategories = [...productDetails.itemCategory];

    if (updatedCategories.includes(category)) {
      // Nếu category đã được chọn, xóa khỏi mảng
      updatedCategories = updatedCategories.filter((cat) => cat !== category);
    } else {
      // Nếu chưa được chọn, thêm vào mảng
      updatedCategories.push(category);
    }

    setProductDetails({ ...productDetails, itemCategory: updatedCategories });
  };

  return (
    <div>
      <div className="mb-10 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">TITLE</h2>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Item title
        </label>
        <input
          type="text"
          name="title"
          value={productDetails.title}
          onChange={handleTitleChange}
          className="w-full border p-2 rounded"
          disabled={disabled} // Disable input nếu disabled
        />
      </div>

      <div className="mb-10 border-t pt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">ITEM CATEGORY</h2>
          {!disabled && ( // Chỉ hiển thị nút Edit khi không bị khóa
            <button className="flex items-center gap-1" onClick={() => setShowCategories(!showCategories)}>
              <svg
                className="relative bottom-[2px]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM13.9334 7.3787L3.86165 17.4505C3.72205 17.5901 3.6269 17.7679 3.58818 17.9615L3.00111 20.8968L5.93645 20.3097C6.13004 20.271 6.30784 20.1759 6.44744 20.0363L16.5192 9.96448L13.9334 7.3787Z"
                  fill="#0F0F0F"
                ></path>
              </svg>
              <p className="font-bold">{showCategories ? 'Save' : 'Edit'}</p>
            </button>
          )}
        </div>

        {/* List of categories for choosing */}
        {showCategories && !disabled && (
          <div className="mt-2 p-2 bg-gray-200 border rounded-md">
            <ul className="list-none">
              {Object.keys(CategoryType).map((category, index) => (
                <li
                  key={index}
                  onClick={() => toggleCategory(category)}
                  className={`cursor-pointer inline-block px-2 py-1 mr-2 my-1 rounded-full ${
                    productDetails.itemCategory.includes(category) ? 'bg-green text-white' : 'bg-gray-100'
                  }`}
                >
                  {CategoryType[category]}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Chosen categories */}
        {!showCategories && (
          <div id="categories" className="mt-4 min-h-[20px]">
            {productDetails.itemCategory.map((category, index) => (
              <span
                key={index}
                className="inline-block bg-green text-white px-2 py-1 rounded-full mr-2 mt-2"
              >
                {CategoryType[category]}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { CategoryType } from '../Enum/CategoryType';

export const ProductDetails = ({ productDetails, setProductDetails }) => {
  const [showCategories, setShowCategories] = useState(false);  // show list of categories for choosing

  const handleTitleChange = (e) => {
    setProductDetails({ ...productDetails, title: e.target.value });
  };

  const toggleCategory = (category) => {
    const updatedCategories = { ...productDetails.itemCategory };

    if (updatedCategories[category]) {
      // if category is already selected, remove it from productDetails.itemCategory
      delete updatedCategories[category];
    } else {
      // if category is not selected, add it to productDetails.itemCategory
      updatedCategories[category] = CategoryType[category];
    }

    setProductDetails({ ...productDetails, itemCategory: updatedCategories });
  };

  return (
    <div>
      <div className="mb-10 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">TITLE</h2>
        <div className='flex border p-2 bg-gray-200 mb-4'>
          <svg className='relative top-[1px]' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 11.75C8.2125 11.75 8.39063 11.6781 8.53438 11.5344C8.67813 11.3906 8.75 11.2125 8.75 11C8.75 10.7875 8.67813 10.6094 8.53438 10.4656C8.39063 10.3219 8.2125 10.25 8 10.25C7.7875 10.25 7.60938 10.3219 7.46563 10.4656C7.32188 10.6094 7.25 10.7875 7.25 11C7.25 11.2125 7.32188 11.3906 7.46563 11.5344C7.60938 11.6781 7.7875 11.75 8 11.75ZM7.25 8.75H8.75V4.25H7.25V8.75ZM8 15.5C6.9625 15.5 5.9875 15.3031 5.075 14.9094C4.1625 14.5156 3.36875 13.9813 2.69375 13.3063C2.01875 12.6313 1.48438 11.8375 1.09063 10.925C0.696875 10.0125 0.5 9.0375 0.5 8C0.5 6.9625 0.696875 5.9875 1.09063 5.075C1.48438 4.1625 2.01875 3.36875 2.69375 2.69375C3.36875 2.01875 4.1625 1.48438 5.075 1.09063C5.9875 0.696875 6.9625 0.5 8 0.5C9.0375 0.5 10.0125 0.696875 10.925 1.09063C11.8375 1.48438 12.6313 2.01875 13.3063 2.69375C13.9813 3.36875 14.5156 4.1625 14.9094 5.075C15.3031 5.9875 15.5 6.9625 15.5 8C15.5 9.0375 15.3031 10.0125 14.9094 10.925C14.5156 11.8375 13.9813 12.6313 13.3063 13.3063C12.6313 13.9813 11.8375 14.5156 10.925 14.9094C10.0125 15.3031 9.0375 15.5 8 15.5Z" fill="#007AFF"/>
          </svg>
          <p className="text-sm ml-1 font-bold">Provide a title for your item. Use words prople would search for when looking for your item.</p>
        </div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Item title</label>
        <input
          type="text"
          name='title'
          value={productDetails.title}
          onChange={handleTitleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-10 border-t pt-4">
        <div className="flex justify-between items-center ">
          <h2 className="text-lg font-semibold">ITEM CATEGORY</h2>
          <button className="flex items-center gap-1" onClick={() => setShowCategories(!showCategories)}>
            <svg className='relative bottom-[2px]' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15">
              <path fillRule="evenodd" clipRule="evenodd" d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM13.9334 7.3787L3.86165 17.4505C3.72205 17.5901 3.6269 17.7679 3.58818 17.9615L3.00111 20.8968L5.93645 20.3097C6.13004 20.271 6.30784 20.1759 6.44744 20.0363L16.5192 9.96448L13.9334 7.3787Z" fill="#0F0F0F"></path>
            </svg>
            <p className="font-bold">{showCategories ? "Save" : "Edit"}</p>
          </button>
        </div>

        {/* List of categories for chooosing */}
        {showCategories && (
          <div className="mt-2 p-2 bg-gray-200 border rounded-md">
            <ul className="list-none">
              {Object.keys(CategoryType).map((category, index) => (
                <li
                  key={index}
                  onClick={() => toggleCategory(category)}
                  className={`cursor-pointer inline-block px-2 py-1 mr-2 my-1 rounded-full ${productDetails.itemCategory[category] ? 'bg-green text-white' : 'bg-gray-100'}`}
                >
                  {CategoryType[category]}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Choosen categories */}
        {!showCategories && (
          <div id="categories" className="mt-4 min-h-[20px]">
            {Object.values(productDetails.itemCategory).map((category, index) => (
              <span key={index} className="inline-block bg-green text-white px-2 py-1 rounded-full mr-2 mt-2">
                {category}
              </span>
            ))}
          </div>
        )} 
      </div>
    </div>
  );
};

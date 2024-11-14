import React from 'react';

export const FilterBar = () => {
  return (
    <div className="flex justify-start mb-4 p-5 border rounded-xl">
      <div className='border rounded-lg pr-2 pl-2'>
        <label>Period:</label>
        <select className="ml-2 p-1 font-bold">
          <option>Last 90 days</option>
        </select>
      </div>
      <div className='ml-10 border rounded-lg flex items-center pl-2'>
        <label>Search by:</label>
        <select className="p-1 font-bold">
          <option>Buyer username</option>
        </select>
        <div className="flex items-center border-l rounded-r">
          <input type="text" className="ml-2 p-1" placeholder="Search..." />
          <span className="mr-2 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

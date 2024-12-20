import React, { useState } from 'react';

export const FilterBar = ({ searchByOptions, searchFunction=(searchByOption, value) => {} }) => {
  const [searchByOption, setSearchByOption] = useState(searchByOptions[0]);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    searchFunction(searchByOption, searchValue);
  }

  return (
    <div className="flex justify-start mb-4 p-5 border rounded-xl">
      {/* <div className='border rounded-lg pr-2 pl-2'>
        <label>Period:</label>
        <select className="ml-2 p-1 font-bold">
          <option>Last 90 days</option>
        </select>
      </div> */}
      <div className='border rounded-lg flex items-center pl-2'>
        <label>Search by:</label>
        <select className="p-1 font-bold" value={searchByOption}
        onChange={(e) => setSearchByOption(e.target.value)}>
          {/* <option>Buyer username</option> */}
          {searchByOptions.map((option, index) => (
            <option key={index}>{option}</option>
          ))}
        </select>
        <div className="flex items-center border-l rounded-r">
          <input type="text" className="ml-2 p-1" placeholder="Search..." value={searchValue || null}
          onSubmit={handleSearch} onChange={(e) => setSearchValue(e.target.value)} />
          <span className="mr-2 cursor-pointer" onClick={handleSearch}>
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

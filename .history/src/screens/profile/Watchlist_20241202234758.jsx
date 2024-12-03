import React, { useState } from 'react';
import { Title } from "../../router";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { RiAuctionFill } from "react-icons/ri";
import { watchlist } from "../../utils/data";
import { Pagination } from "../../router";
import axiosClient from "../../services/axiosClient";
import { authUtils } from '../../utils/authUtils';


export const Watchlist = () => {
  const itemsPerPage = 5;
  const pagesPerGroup = 3; 
  const [currentPage, setCurrentPage] = useState(1);
  const [watchlist, setWatchlist] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const userId = authUtils.getCurrentUserId();
  
  // Pagination logic

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = watchlist.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Title level={4}>My Watchlist</Title>
        <SearchBox />
      </div>
      
      <div className="h-px bg-gray-200 my-6" />
      
      <Table items={currentItems} /> {/* Pass the current page items */}
      
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        pagesPerGroup={pagesPerGroup}
        onPageChange={handlePageChange}
      /> {/* Pagination component */}
    </div>
  );
};

const SearchBox = () => {
  return (
    <div className="relative w-full max-w-xs">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IoIosSearch className="text-gray-500" size={16} />
      </div>
      <input 
        type="search" 
        className="w-full pl-9 pr-4 py-2 text-sm text-gray-900 rounded-lg bg-gray-50 border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search auction..."
      />
    </div>
  );
};

const Table = ({ items }) => {
  return (
    <div className="relative overflow-x-auto rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-10 py-5">Image</th>
            <th scope="col" className="px-6 py-3">Title</th>
            <th scope="col" className="px-6 py-3 text-center">Current Bid</th>
            <th scope="col" className="px-6 py-3 text-center">Your Bid</th>
            <th scope="col" className="px-6 py-3 text-center">Status</th>
            <th scope="col" className="px-6 py-3 text-center">Time Left</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4">
                <img className="w-20 h-20 rounded-md" src={item.image} alt="Item" />
              </td>
              <td className="px-6 py-4">{item.title}</td>
              <td className="px-6 py-4 text-center">{item.currentBid}</td>
              <td className="px-6 py-4 text-center">{item.yourBid}</td>
              <td className="px-6 py-4 text-center">
                <div
                  className={`inline-block w-24 px-2 py-1 text-sm border-2 rounded-full text-center truncate rounded-full ${
                    item.status === "Winning" ? "text-green border-emerald-500" : "text-red-500 border-red-500"
                  }`}
                >
                  {item.status}
                </div>
              </td>
              <td className="px-6 py-4 text-center text-red-500">{item.timeLeft}</td>
              <td className="px-6 py-4 text-center flex items-center gap-3 mt-5">
                <button>
                  <RiAuctionFill size={24} className="font-medium text-green" />
                </button>
                <button className="font-medium text-red-500">
                  <MdOutlineDeleteOutline size={27} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

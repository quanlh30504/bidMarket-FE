import React, { useState, useEffect } from 'react';
import { Title } from "../../router";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { RiAuctionFill } from "react-icons/ri";
import { Pagination } from "../../router";
import axiosClient from "../../services/axiosClient";
import { authUtils } from '../../utils/authUtils';
import { useNavigate } from "react-router-dom";
import debounce from 'lodash.debounce';

export const Watchlist = () => {
  const itemsPerPage = 3;
  const pagesPerGroup = 3; 
  const [currentPage, setCurrentPage] = useState(1);
  const [watchlist, setWatchlist] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const userId = authUtils.getCurrentUserId();
  const navigate = useNavigate();

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const fetchWatchlist = async (page, searchTerm) => {
    try {
      const response = await axiosClient.get(`/api/watchlist/user/${userId}`, {
        params: {
          page: page - 1,  
          size: itemsPerPage,
          sortBy: 'createdAt',  
          sortDirection: 'DESC',
          
        }
      });
      setWatchlist(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  useEffect(() => {
    fetchWatchlist(currentPage, searchTerm); // Gọi API khi có thay đổi tìm kiếm hoặc trang
  }, [currentPage, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleAuctionClick = (item) => {
    navigate(`/details/${item.auctionId}`);
  };

  const handleRemoveFromWatchlist = async (watchlistId) => {
    try {
      const response = await axiosClient.delete(`/api/watchlist/remove/${watchlistId}`);
      if (response.status === 200) {
        fetchWatchlist(currentPage); 
      } else {
        console.error("Failed to remove from watchlist:", response.status);
      }
    } catch (error) {
      console.error("Error removing from watchlist:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Title level={4}>My Watchlist</Title>
        <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      
      <div className="h-px bg-gray-200 my-6" />
      
      <Table items={watchlist} 
            handleAuctionClick={handleAuctionClick}
            handleRemoveFromWatchlist={handleRemoveFromWatchlist} 
      />
      
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        pagesPerGroup={pagesPerGroup}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

const SearchBox = ({ searchTerm, setSearchTerm }) => {
  const handleSearchChange = debounce((value) => {
    setSearchTerm(value);
    // console.log(value);
  }, 500); 

  return (
    <div className="relative w-full max-w-xs">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IoIosSearch className="text-gray-500" size={16} />
      </div>
      <input
        type="search"
        className="w-full pl-9 pr-4 py-2 text-sm text-gray-900 rounded-lg bg-gray-50 border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search auction..."
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)} 
      />
    </div>
  );
};

const Table = ({ items, handleAuctionClick, handleRemoveFromWatchlist }) => {
  const calculateTimeLeft = (endTime) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return days > 0
      ? `${days}d ${hours}h`
      : `${hours}h ${minutes}m ${seconds}s`;
  };

  const [timeLeftData, setTimeLeftData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimeLeft = items.map((item) =>
        calculateTimeLeft(item.endTime)
      );
      setTimeLeftData(updatedTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [items]);

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
                <img className="w-20 h-20 rounded-md" src={item.productImageUrl} alt="Item" />
              </td>
              <td className="px-6 py-4">{item.auctionTitle}</td>
              <td className="px-6 py-4 text-center">{item.currentPrice}</td>
              <td className="px-6 py-4 text-center">{item.bidCount}</td>
              <td className="px-6 py-4 text-center">
                <div
                  className={`inline-block w-24 px-2 py-1 text-sm border-2 rounded-full text-center truncate rounded-full ${
                    item.status === "Winning" ? "text-green border-emerald-500" : "text-red-500 border-red-500"
                  }`}
                >
                  {item.status}
                </div>
              </td>
              <td className="px-6 py-4 text-center text-red-500"> {timeLeftData[index] || "Calculating..."}</td>
              <td className="px-6 py-4 text-center flex items-center gap-3 mt-5">
                <button onClick={() => handleAuctionClick(item)}>
                  <RiAuctionFill size={24} className="font-medium text-green" />
                </button>
                <button className="font-medium text-red-500" onClick={() => handleRemoveFromWatchlist(item.id)}>
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

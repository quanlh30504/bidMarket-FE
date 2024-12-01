import React, { useState, useEffect } from 'react';
import { FilterBar } from '../components/FilterBar';
import { Table } from '../components/Table';
import { Sidebar } from '../components/Sidebar';
import AdminService from '../../../services/adminService';
import { AuctionStatus } from '../../../router';

export const AuctionManagement = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('All auctions');
  const [items, setItems] = useState([]);

  const menuItems = [
    'All auctions',
    'Pending',
    'Open',
  ];

  const sortOptions = [
    { value: 'start', label: 'Start Date' },
    { value: 'end', label: 'End Date' },
    { value: 'highest', label: 'Highest price' },
    { value: 'lowest', label: 'Lowest price' }
  ];

  const formatAuctionData = (response) => {
    return response.content.map(auction => {
      return {
        hidden_id: auction.id,
        auction: auction.title,
        "Starting price": auction.startingPrice,
        "Current price": auction.currentPrice,
        "Start time": auction.startTime,
        "End time": auction.endTime,
        status: AuctionStatus[auction.status],
      };
    });
  };

  const handleChangeActiveMenuItem = async (activeMenuItem) => {
    let filterStatus = '';
    switch (activeMenuItem) {
      case 'Open':
        filterStatus = 'OPEN';
        break;
      case 'Pending':
        filterStatus = 'PENDING';
        break;
      default:
        filterStatus = '';
        break;
    }
    const response = (await AdminService.searchAuctions({ status: filterStatus })).data;
    setItems(formatAuctionData(response));
  }

  const sortOrders = (sortBy) => {
    window.alert(`Sorting by ${sortBy}`);
    // some sorting logic return ordered items (use setItems) (later)
  }

  const header = (activeMenuItems) => {
    switch (activeMenuItems) {
        case 'All auctions':
            return 'Manage all auctions';
        case 'Open':
            return 'Manage open auctions';
        case 'Pending':
            return 'Manage pending auctions';
        default:
            return 'All auctions';
    }
  }

  useEffect(() => {
    handleChangeActiveMenuItem(activeMenuItem);
  }, [activeMenuItem]);

  // useEffect(() => {
  //   const fetchAuctions = async () => {
  //     try {
  //       const response = await AdminService.getAllAuctions(); // Gọi API để lấy tất cả đấu giá
  //       setItems(formatAuctionData(response.data));
  //     } catch (error) {
  //       console.error("Error fetching auctions:", error);
  //     }
  //   };  
  //   fetchAuctions();
  // }, []);

  return (
    <div className="flex">
      <Sidebar menuItems={menuItems} activeMenuItem={activeMenuItem} setActiveMenuItem={setActiveMenuItem} />
      <div className="w-5/6 p-6">
        <h1 className="text-2xl mb-4">{ header(activeMenuItem) }</h1>
        <FilterBar />
        <Table items={items} sortOptions={sortOptions} sortFuntion={sortOrders} />
      </div>
    </div>
  );
};

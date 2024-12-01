import React, { useState, useEffect } from 'react';
import { FilterBar } from '../components/FilterBar';
import { Table } from '../components/Table';
import { Sidebar } from '../components/Sidebar';
import AdminService from '../../../services/adminService';
import { AuctionStatus } from '../../../router';

export const AuctionManagement = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('All auctions');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    all: [],
    open: [],
    pending: [],
  });

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

  const refreshData = async () => {
    setLoading(true);
    try {
      const all = (await AdminService.searchAuctions({ status: '' })).data;
      const open = (await AdminService.searchAuctions({ status: 'OPEN' })).data;
      const pending = (await AdminService.searchAuctions({ status: 'PENDING' })).data;
      setData({
        all: formatAuctionData(all),
        open: formatAuctionData(open),
        pending: formatAuctionData(pending),
      });
      console.log('Data fetched:', data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleChangeActiveMenuItem = async (activeMenuItem) => {
    switch (activeMenuItem) {
      case 'Open':
        setItems(data.open);
        return;
      case 'Pending':
        setItems(data.pending);
        return;
      default:
        setItems(data.all);
        return;
    }
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
  }, [activeMenuItem, data]);

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="flex">
      <Sidebar menuItems={menuItems} activeMenuItem={activeMenuItem} setActiveMenuItem={setActiveMenuItem} />
      <div className="w-5/6 p-6 relative">
        <h1 className="text-2xl mb-4 inline-block">{ header(activeMenuItem) }</h1>
        <button className='ml-4 align-middle' onClick={refreshData} title='Refresh'>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 12C21 16.9706 16.9706 21 12 21C9.69494 21 7.59227 20.1334 6 18.7083L3 16M3 12C3 7.02944 7.02944 3 12 3C14.3051 3 16.4077 3.86656 18 5.29168L21 8M3 21V16M3 16H8M21 3V8M21 8H16" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
        </button>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <FilterBar />
            <Table items={items} sortOptions={sortOptions} sortFunction={sortOrders} />
          </>
        )}
      </div>
    </div>
  );
};

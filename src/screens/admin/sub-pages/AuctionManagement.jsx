import React, { useState, useEffect, useCallback } from 'react';
import { FilterBar } from '../../seller-hub/components/FilterBar';
import { Table } from '../../seller-hub/components/Table';
import { Sidebar } from '../../seller-hub/components/Sidebar';
import AdminService from '../../../services/adminService';
import { AuctionStatus, Pagination } from '../../../router';

export const AuctionManagement = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('All auctions');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    all: [],
    open: [],
    pending: [],
  });
  const [auctionFilters_all, setAuctionFilters_all] = useState({
    sellerId: null,
    title: null,
    categoryType: [],
    status: null,
    minPrice: null,
    maxPrice: null,
    startTime: null,
    endTime: null,
    page: 0,
    size: 10,
    sortField: 'currentPrice',
    sortDirection: 'ASC',
  });

  const [auctionFilters_open, setAuctionFilters_open] = useState({
    ...auctionFilters_all,
    status: 'OPEN',  
  });

  const [auctionFilters_pending, setAuctionFilters_pending] = useState({
    ...auctionFilters_all,
    status: 'PENDING',  
  });

  const [auctionTotalItems_all, setAuctionTotalItems_all] = useState(0);
  const [auctionTotalItems_open, setAuctionTotalItems_open] = useState(0);
  const [auctionTotalItems_pending, setAuctionTotalItems_pending] = useState(0);

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

  const handlePageChange = async (newPage) => {
    if (activeMenuItem === 'All auctions') {
      setAuctionFilters_all((prevFilters) => ({ ...prevFilters, page: newPage - 1 }));
    } else if (activeMenuItem === 'Open') {
      setAuctionFilters_open((prevFilters) => ({ ...prevFilters, page: newPage - 1 }));
    } else if (activeMenuItem === 'Pending') {
      setAuctionFilters_pending((prevFilters) => ({ ...prevFilters, page: newPage - 1 }));
    }
  };

  const fetchAuctionsAll = useCallback(async () => {
    try {
      const response = await AdminService.searchAuctions(auctionFilters_all);
      setData((prevData) => ({ ...prevData, all: formatAuctionData(response.data) }));
      setAuctionTotalItems_all(response.data.totalElements);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
    }
  }, [auctionFilters_all]);

  const fetchAuctionsOpen = useCallback(async () => {
    try {
      const response = await AdminService.searchAuctions(auctionFilters_open);
      setData((prevData) => ({ ...prevData, open: formatAuctionData(response.data) }));
      setAuctionTotalItems_open(response.data.totalElements);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
    }
  }, [auctionFilters_open]);

  const fetchAuctionsPending = useCallback(async () => {
    try {
      const response = await AdminService.searchAuctions(auctionFilters_pending);
      setData((prevData) => ({ ...prevData, pending: formatAuctionData(response.data) }));
      setAuctionTotalItems_pending(response.data.totalElements);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
    }
  }, [auctionFilters_pending]);

  const refreshData = async () => {
    setLoading(true);
    switch (activeMenuItem) {
      case 'All auctions':
        fetchAuctionsAll();
        break;
      case 'Open':
        fetchAuctionsOpen();
        break;
      case 'Pending':
        fetchAuctionsPending();
        break;
      default:
        break;
    }
    setLoading(false);
  };

  const sortOrders = (sortBy) => {
    window.alert(`Sorting by ${sortBy}`);
    // some sorting logic return ordered items (use setItems) (later)
  };

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
  };

  useEffect(() => {
    fetchAuctionsAll();
  }, [fetchAuctionsAll]);

  useEffect(() => {
    fetchAuctionsOpen();
  }, [fetchAuctionsOpen]);

  useEffect(() => {
    fetchAuctionsPending();
  }, [fetchAuctionsPending]);

  useEffect(() => {
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
    };
    handleChangeActiveMenuItem(activeMenuItem);
  }, [activeMenuItem, data]);

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
            <Pagination
              totalItems={activeMenuItem === 'All auctions' ? auctionTotalItems_all : activeMenuItem === 'Open' ? auctionTotalItems_open : auctionTotalItems_pending}
              itemsPerPage={activeMenuItem === 'All auctions' ? auctionFilters_all.size : activeMenuItem === 'Open' ? auctionFilters_open.size : auctionFilters_pending.size}
              pagesPerGroup={3}
              onPageChange={handlePageChange}
              currentPageByParent={activeMenuItem === 'All auctions' ? auctionFilters_all.page + 1 : activeMenuItem === 'Open' ? auctionFilters_open.page + 1 : auctionFilters_pending.page + 1}
            />
          </>
        )}
      </div>
    </div>
  );
};

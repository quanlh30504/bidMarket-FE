import React, { useState, useEffect, useCallback } from 'react';
import { FilterBar } from '../../seller-hub/components/FilterBar';
import { Table } from '../../seller-hub/components/Table';
import { Sidebar } from '../../seller-hub/components/Sidebar';
import AdminService from '../../../services/adminService';
import { Role, Pagination } from '../../../router/index';

export const UserManagement = () => {
  const [items, setItems] = useState([]);
  const [activeMenuItem, setActiveMenuItem] = useState('All users');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    all: [],
    sellers: [],
    bidders: [],
    inactive: [],
    banned: [],
  });

  // Filters state below
  const [userFilters_all, setUserFilters_all] = useState({
    email: null,
    role: null,
    isBanned: null,
    isVerified: null,
    page: 0,
    size: 10,
    sortBy: null,
    sortDirection: null,
  });
  const [userFilters_sellers, setUserFilters_sellers] = useState({
    ...userFilters_all,
    role: 'SELLER',
  });
  const [userFilters_bidders, setUserFilters_bidders] = useState({
    ...userFilters_all,
    role: 'BIDDER',
  });
  const [userFilters_inactive, setUserFilters_inactive] = useState({
    ...userFilters_all,
    isVerified: false,
  });
  const [userFilters_banned, setUserFilters_banned] = useState({
    ...userFilters_all,
    isBanned: true,
  });
  const [userTotalItems_all, setUserTotalItems_all] = useState(0);
  const [userTotalItems_sellers, setUserTotalItems_sellers] = useState(0);
  const [userTotalItems_bidders, setUserTotalItems_bidders] = useState(0);
  const [userTotalItems_inactive, setUserTotalItems_inactive] = useState(0);
  const [userTotalItems_banned, setUserTotalItems_banned] = useState(0);

  const menuItems = [
    'All users',
    'Sellers',
    'Bidders',
    'Inactive',
    'Banned',
  ];

  const sortOptions = [
    { value: 'username', label: 'Username' },
    { value: 'email', label: 'Email' },
    { value: 'status', label: 'Status' },
  ];

  const header = (activeMenuItems) => {
    switch (activeMenuItems) {
        case 'All users':
            return 'Manage all users';
        case 'Sellers':
            return 'Manage sellers';
        case 'Bidders':
            return 'Manage Bidders';
        case 'Inactive':
            return 'Manage inactive users';
        default:
            return 'All users';
        }
  }

  function sortOrders(sortBy) {
    window.alert(`Sorting by ${sortBy}`);
    // some sorting logic return ordered items (use setItems) (later)
  }

  const formatUserData = (response) => {
    return response.content.map(user => {
      return {
        username: user.profile && user.profile.fullName ? user.profile.fullName : 'Unknown',
        email: user.email,
        role: Role[user.role],
        "Is verified": user.verified ? 'Yes' : 'No',
        "Is banned": user.banned ? 'Yes' : 'No',
      };
    });
  }

  const handlePageChange = async (newPage) => {
    if (activeMenuItem === 'All users') {
      setUserFilters_all({ ...userFilters_all, page: newPage - 1 });
    }
    if (activeMenuItem === 'Sellers') {
      setUserFilters_sellers({ ...userFilters_sellers, page: newPage - 1 });
    }
    if (activeMenuItem === 'Bidders') {
      setUserFilters_bidders({ ...userFilters_bidders, page: newPage - 1 });
    }
    if (activeMenuItem === 'Inactive') {
      setUserFilters_inactive({ ...userFilters_inactive, page: newPage - 1 });
    }
    if (activeMenuItem === 'Banned') {
      setUserFilters_banned({ ...userFilters_banned, page: newPage - 1 });
    }
  };

  const fetchUsersAll = useCallback(async () => {
    try {
      const response = await AdminService.searchUsers(userFilters_all);
      setData((prevData) => ({ ...prevData, all: formatUserData(response.data) }));
      setUserTotalItems_all(response.data.totalElements);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
    }
  }, [userFilters_all]);

  const fetchUsersSellers = useCallback(async () => {
    try {
      const response = await AdminService.searchUsers(userFilters_sellers);
      setData((prevData) => ({ ...prevData, sellers: formatUserData(response.data) }));
      setUserTotalItems_sellers(response.data.totalElements);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
    }
  }, [userFilters_sellers]);

  const fetchUsersBidders = useCallback(async () => {
    try {
      const response = await AdminService.searchUsers(userFilters_bidders);
      setData((prevData) => ({ ...prevData, bidders: formatUserData(response.data) }));
      setUserTotalItems_bidders(response.data.totalElements);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
    }
  }, [userFilters_bidders]);

  const fetchUsersInactive = useCallback(async () => {
    try {
      const response = await AdminService.searchUsers(userFilters_inactive);
      setData((prevData) => ({ ...prevData, inactive: formatUserData(response.data) }));
      setUserTotalItems_inactive(response.data.totalElements);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
    }
  }, [userFilters_inactive]);

  const fetchUsersBanned = useCallback(async () => {
    try {
      const response = await AdminService.searchUsers(userFilters_banned);
      setData((prevData) => ({ ...prevData, banned: formatUserData(response.data) }));
      setUserTotalItems_banned(response.data.totalElements);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
    }
  }, [userFilters_banned]);

  const refreshData = async () => {
    setLoading(true);
    switch (activeMenuItem) {
      case 'All users':
        fetchUsersAll();
        break;
      case 'Sellers':
        fetchUsersSellers();
        break;
      case 'Bidders':
        fetchUsersBidders();
        break;
      case 'Inactive':
        fetchUsersInactive();
        break;
      case 'Banned':
        fetchUsersBanned();
        break;
      default:
        break;
    }
    setLoading(false);
  }

  useEffect(() => {
    const handleChangeActiveMenuItem = async () => {
      switch (activeMenuItem) {
        case 'Sellers':
          setItems(data.sellers);
          return;
        case 'Bidders':
          setItems(data.bidders);
          return;
        case 'Inactive':
          setItems(data.inactive);
          return;
        case 'Banned':
          setItems(data.banned);
          return;
        default:
          setItems(data.all);
          return;
      }
    };
    handleChangeActiveMenuItem();
  }, [activeMenuItem, data]);

  useEffect(() => {
    fetchUsersAll();
  }, [fetchUsersAll]);

  useEffect(() => {
    fetchUsersSellers();
  }, [fetchUsersSellers]);

  useEffect(() => {
    fetchUsersBidders();
  }, [fetchUsersBidders]);

  useEffect(() => {
    fetchUsersInactive();
  }, [fetchUsersInactive]);

  useEffect(() => {
    fetchUsersBanned();
  }, [fetchUsersBanned]);

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
              totalItems={activeMenuItem === 'All users' ? userTotalItems_all : activeMenuItem === 'Sellers' ? userTotalItems_sellers : activeMenuItem === 'Bidders' ? userTotalItems_bidders : activeMenuItem === 'Inactive' ? userTotalItems_inactive : userTotalItems_banned}
              itemsPerPage={userFilters_all.size}
              pagesPerGroup={3}
              onPageChange={handlePageChange}
              currentPageByParent={activeMenuItem === 'All users' ? userFilters_all.page + 1 : activeMenuItem === 'Sellers' ? userFilters_sellers.page + 1 : activeMenuItem === 'Bidders' ? userFilters_bidders.page + 1 : activeMenuItem === 'Inactive' ? userFilters_inactive.page + 1 : userFilters_banned.page + 1}
            />
          </>
        )}
      </div>
    </div>
  );
};

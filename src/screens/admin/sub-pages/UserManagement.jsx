import React, { useState, useEffect } from 'react';
import { FilterBar } from '../components/FilterBar';
import { Table } from '../components/Table';
import { Sidebar } from '../components/Sidebar';
import AdminService from '../../../services/adminService';
import { Role } from '../../../router/index';

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
    return response.map(user => {
      return {
        username: user.profile && user.profile.fullName ? user.profile.fullName : 'Unknown',
        email: user.email,
        role: Role[user.role],
        "Is verified": user.verified ? 'Yes' : 'No',
        "Is banned": user.banned ? 'Yes' : 'No',
      };
    });
  }

  const refreshData = async () => {
    setLoading(true);
    try {
      const all = (await AdminService.searchUsers({ role: '', isVerified: '', isBanned: '' })).data.content;
      const sellers = all.filter(user => user.role === 'SELLER');
      const bidders = all.filter(user => user.role === 'BIDDER');
      const inactive = all.filter(user => !user.verified);
      const banned = all.filter(user => user.banned);

      setData({
        all: formatUserData(all),
        sellers: formatUserData(sellers),
        bidders: formatUserData(bidders),
        inactive: formatUserData(inactive),
        banned: formatUserData(banned),
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

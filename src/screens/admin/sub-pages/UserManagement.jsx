import React, { useState, useEffect } from 'react';
import { FilterBar } from '../components/FilterBar';
import { Table } from '../components/Table';
import { Sidebar } from '../components/Sidebar';
import AdminService from '../../../services/adminService';
import { Role } from '../Enum/Role';

export const UserManagement = () => {
  const [items, setItems] = useState([]);
  const [activeMenuItem, setActiveMenuItem] = useState('All users');

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

  const handleChangeActiveMenuItem = async (activeMenuItem) => {
    let filterRole = '';
    let filterVerify = '';
    let filterBanned = '';
    switch (activeMenuItem) {
      case 'Sellers':
          filterRole = 'SELLER';
          break;
      case 'Bidders':
          filterRole = 'BIDDER';
          break;
      case 'Inactive':
          filterVerify = false;
          break;
      case 'Banned':
          filterBanned = true;
          break;
      default:
          break;
    }
    const response = await (await AdminService.searchUsers({ role: filterRole, isVerified: filterVerify, isBanned: filterBanned })).data
    console.log("response", response);
    setItems(formatUserData(response));
  }

  useEffect(() => {
    try {
      handleChangeActiveMenuItem(activeMenuItem);
    } catch (error) {
      console.error(error);
    }
  }, [activeMenuItem, items]);

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

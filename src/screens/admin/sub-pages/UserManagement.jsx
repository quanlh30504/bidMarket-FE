import React, { useState, useEffect } from 'react';
import { FilterBar } from '../components/FilterBar';
import { Table } from '../components/Table';
import { Sidebar } from '../components/Sidebar';

//sample
const userData = [
    {
      username: 'john_doe',
      email: 'john@example.com',
      role: 'Seller',
      status: 'Active'
    },
    {
      username: 'jane_doe',
      email: 'jane@example.com',
      role: 'Buyer',
      status: 'Inactive'
    },
    // ... More users
  ];

export const UserManagement = () => {
  const menuItems = [
    'All users',
    'Sellers',
    'Buyers',
    'Inactive',
  ];
  const [activeMenuItem, setActiveMenuItem] = useState('All users');
  const [items, setItems] = useState(userData);
  const sortOptions = [
    { value: 'username', label: 'Username' },
    { value: 'email', label: 'Email' },
    { value: 'status', label: 'Status' },
  ];

  const sideBarFilter = (activeMenuItem) => {
    switch (activeMenuItem) {
        case 'All users':
            setItems(userData);
            return;
        case 'Sellers':
            setItems(userData.filter((user) => user.role === 'Seller'));
            return;
        case 'Buyers':
            setItems(userData.filter((user) => user.role === 'Buyer'));
            return;
        case 'Inactive':
            setItems(userData.filter((user) => user.status === 'Inactive'));
            return;
        default:
            return;
        }
  }

  useEffect(() => {
    sideBarFilter(activeMenuItem);
  }, [activeMenuItem]);

  function sortOrders(sortBy) {
    window.alert(`Sorting by ${sortBy}`);
    // some sorting logic return ordered items (use setItems) (later)
  }

  function header(activeMenuItems) {
    switch (activeMenuItems) {
        case 'All users':
            return 'Manage all users';
        case 'Sellers':
            return 'Manage sellers';
        case 'Buyers':
            return 'Manage buyers';
        case 'Inactive':
            return 'Manage inactive users';
        default:
            return 'All users';
        }
  }

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

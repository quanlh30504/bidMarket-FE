import React, { useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { Table } from '../components/Table';
import { Sidebar } from '../components/Sidebar';

//sample
const ordersData = [ 
  {
    auction: '1883 Sweden 50 Ore - Original Silver Coin - Lot 36a',
    quantity: 1,
    price: 'US $7.99',
    winner: 'tonystack@gmail.com',
    carrier: 'ABC',
    status: 'Unpaid'
  },
];

export const Orders = () => {
  const menuItems = [
    'All orders',
    'Awaiting payment',
    'Awaiting shipment',
    'Paid and shipped',
    'Archived',
    'Cancellations',
    'Returns'
  ];
  const [activeMenuItem, setActiveMenuItem] = useState('All orders');
  const [items, setItems] = useState(ordersData);
  const sortOptions = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'highest', label: 'Highest price' },
    { value: 'lowest', label: 'Lowest price' }
  ];

  function sortOrders(sortBy) {
    window.alert(`Sorting by ${sortBy}`);
    // some sorting logic return ordered items (use setItems) (later)
  }

  function header(activeMenuItems) {
    switch (activeMenuItems) {
      case 'All orders':
        return 'Manage all orders';
      case 'Awaiting payment':
        return 'Manage orders awaiting payment';
      case 'Awaiting shipment':
        return 'Manage orders awaiting shipment';
      case 'Paid and shipped':
        return 'Manage paid and shipped orders';
      case 'Archived':
        return 'Manage archived orders';
      case 'Cancellations':
        return 'Manage cancellations';
      case 'Returns':
        return 'Manage returns';
      default:
        return 'All orders';
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

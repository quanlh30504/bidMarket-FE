// import React, { useState } from 'react';
// import { Table } from '../components/Table';
// import { Sidebar } from '../components/Sidebar';

// export const AuctionManagement = () => {
//   const [items, setItems] = useState(auctionData);
//   const sortOptions = [
//     { value: 'start', label: 'Start Date' },
//     { value: 'end', label: 'End Date' },
//     { value: 'highest', label: 'Highest price' },
//     { value: 'lowest', label: 'Lowest price' }
//   ];

//   function sortAuctions(sortBy) {
//     // Sorting logic can be implemented here
//     window.alert(`Sorting by ${sortBy}`);
//   }

//   return (
//     <div className="w-5/6 p-6">
//       <h1 className="text-2xl mb-4">Manage Auctions</h1>
//       <Table items={items} sortOptions={sortOptions} sortFuntion={sortAuctions} />
//     </div>
//   );
// };


import React, { useState, useEffect } from 'react';
import { FilterBar } from '../components/FilterBar';
import { Table } from '../components/Table';
import { Sidebar } from '../components/Sidebar';

//sample
const auctionData = [
    {
      auction: '1883 Sweden 50 Ore - Original Silver Coin - Lot 36a',
      start: 'August 1, 2024',
      end: 'August 15, 2024',
      "start price": '$100',
      "current price": '$200',
      status: 'Open'
    },
    {
        auction: '1883 Sweden 50 Ore - Original Silver Coin - Lot 36b',
        start: 'August 1, 2024',
        end: 'August 15, 2024',
        "start price": '$100',
        "current price": '$200',
        status: 'Closed'
    },
    {
        auction: '1883 Sweden 50 Ore - Original Silver Coin - Lot 36c',
        start: 'August 1, 2024',
        end: 'August 15, 2024',
        "start price": '$100',
        "current price": '$200',
        status: 'Canceled'
    },
    {
        auction: '1883 Sweden 50 Ore - Original Silver Coin - Lot 36d',
        start: 'August 1, 2024',
        end: 'August 15, 2024',
        "start price": '$100',
        "current price": '$200',
        status: 'Pending'
    }
  ];

export const AuctionManagement = () => {
  const menuItems = [
    'All auctions',
    'Open',
    'Closed',
    'Canceled',
    'Pending',
  ];
  const [activeMenuItem, setActiveMenuItem] = useState('All auctions');
  const [items, setItems] = useState(auctionData);
  const sortOptions = [
    { value: 'start', label: 'Start Date' },
    { value: 'end', label: 'End Date' },
    { value: 'highest', label: 'Highest price' },
    { value: 'lowest', label: 'Lowest price' }
  ];

  const sideBarFilter = (activeMenuItem) => {
    switch (activeMenuItem) {
        case 'All auctions':
            setItems(auctionData);
            return;
        case 'Open':
            setItems(auctionData.filter((auction) => auction.status === 'Open'));
            return;
        case 'Closed':
            setItems(auctionData.filter((auction) => auction.status === 'Closed'));
            return;
        case 'Canceled':
            setItems(auctionData.filter((auction) => auction.status === 'Canceled'));
            return;
        case 'Pending':
            setItems(auctionData.filter((auction) => auction.status === 'Pending'));
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
        case 'All auctions':
            return 'Manage all auctions';
        case 'Open':
            return 'Manage open auctions';
        case 'Closed':
            return 'Manage closed auctions';
        case 'Canceled':
            return 'Manage canceled auctions';
        case 'Pending':
            return 'Manage pending auctions';
        default:
            return 'All auctions';
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

import React, { useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { Table } from '../components/Table';
import { Sidebar } from '../components/Sidebar';

//sample
const auctionData = [ 
  {
    auction: '1883 Sweden 50 Ore - Original Silver Coin - Lot 36a',
    quantity: 1,
    price: 'US $7.99',
    winner: 'tonystack@gmail.com',
    carrier: 'ABC',
    status: 'Open'
  },
  {
    auction: '1883 Sweden 50 Ore - Original Silver Coin - Lot 36a',
    quantity: 1,
    price: 'US $7.99',
    winner: 'tonystack@gmail.com',
    carrier: 'ABC',
    status: 'Pending'
  },
  {
    auction: '1883 Sweden 50 Ore - Original Silver Coin - Lot 36a',
    quantity: 1,
    price: 'US $7.99',
    winner: 'tonystack@gmail.com',
    carrier: 'ABC',
    status: 'Canceled'
  },
  {
    auction: '1883 Sweden 50 Ore - Original Silver Coin - Lot 36a',
    quantity: 1,
    price: 'US $7.99',
    winner: 'tonystack@gmail.com',
    carrier: 'ABC',
    status: 'Closed'
  },
  {
    auction: '1883 Sweden 50 Ore - Original Silver Coin - Lot 36a',
    quantity: 1,
    price: 'US $7.99',
    winner: 'tonystack@gmail.com',
    carrier: 'ABC',
    status: 'Completed'
  },
];

const productData = [
  {
    product: '1883 Sweden 50 Ore - Original Silver Coin - Lot 36a',
    categories: ['Coins', 'Metalware'],
    status: 'Active'
  },
  {
    product: '1883 Sweden 50 Ore - Original Silver Coin - Lot 36a',
    categories: ['Coins', 'Metalware'],
    status: 'Inactive'
  },
  {
    product: '1883 Sweden 50 Ore - Original Silver Coin - Lot 36a',
    categories: ['Coins', 'Metalware'],
    status: 'Sold'
  },
]


export const Listings = () => {
  const menuItems = [
    'Auction',
    'Products'
  ];
  const [activeMenuItem, setActiveMenuItem] = useState('Auction');
  const [items, setItems] = useState(auctionData);
  const sortOptions = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'highest', label: 'Highest price' },
    { value: 'lowest', label: 'Lowest price' }
  ];

  function handleChangeMenuItems(activeMenuItem) {  // change table data based on menu item
    // api + logic (later)
    if(activeMenuItem === 'Auction') {
      setItems(auctionData);
    } else {
      setItems(productData);
    }
  }
  React.useEffect(() => {
    handleChangeMenuItems(activeMenuItem);
  }, [activeMenuItem]);

  function sortListings(sortBy) {  // có thể là 2 sort function riêng cho Auction và Products
    window.alert(`Sorting by ${sortBy}`);
    // some sorting logic return ordered items (use setItems) (later)
  }

  function header(activeMenuItems) {
    switch (activeMenuItems) {
      case 'Auction':
        return 'Manage auctions';
      case 'Products':
        return 'Manage products';
      default:
        return 'Manage auctions';
    }
  }

  return (
    <div className="flex">
      <Sidebar menuItems={menuItems} activeMenuItem={activeMenuItem} setActiveMenuItem={setActiveMenuItem} />
      <div className="w-5/6 p-6">
        <h1 className="text-2xl mb-4">{ header(activeMenuItem) }</h1>
        <FilterBar />
        <Table items={items} sortOptions={sortOptions} sortFuntion={sortListings} />
      </div>
    </div>
  );
};

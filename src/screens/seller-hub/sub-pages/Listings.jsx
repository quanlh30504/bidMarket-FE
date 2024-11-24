import React, { useState, useEffect } from 'react';
import { FilterBar } from '../components/FilterBar';
import { Table } from '../components/Table';
import { Sidebar } from '../components/Sidebar';
import AuctionService from '../../../services/auctionService';
import ProductService from '../../../services/productService';
import { useUser, ProductStatus, CategoryType, AuctionStatus } from '../../../router';


export const Listings = () => {
  const { user } = useUser();
  const menuItems = [
    'Auction',
    'Products'
  ];
  const [activeMenuItem, setActiveMenuItem] = useState('Auction');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const sortOptions = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'highest', label: 'Highest price' },
    { value: 'lowest', label: 'Lowest price' }
  ];

  const formatProductData = (response) => {
    return response.content.map(product => {
      return {
        product: product.name,
        categories: product.categories && product.categories.length > 0 
        ? product.categories.map(category => CategoryType[category] || category) // Ánh xạ từng danh mục
        : ['No Category'], // Trường hợp mảng trống hoặc undefined
        status: ProductStatus[product.productStatus] || product.productStatus,
      };
    });
  }

  const formatAuctionData = (response) => {
    return response.content.map(auction => {
      return {
        auction: auction.title,
        start: auction.startTime,
        end: auction.endTime,
        "start price": `$${auction.startingPrice.toFixed(2)}`, // Định dạng lại để có dấu $
        "current price": `$${auction.currentPrice.toFixed(2)}`, // Định dạng lại để có dấu $
        status: AuctionStatus[auction.status] || auction.status,
      };
    });
  }

  const handleChangeMenuItems = async (activeMenuItem) => {
    setLoading(true);
    try {
      if (activeMenuItem === 'Auction') {
        // Call AuctionService to get auction data
        const response = await AuctionService.searchAuctions({ sellerId: user.UUID });
        setItems(formatAuctionData(response.data));
      } else if (activeMenuItem === 'Products') {
        // Call ProductService to get product data
        const response = await ProductService.searchProducts({ sellerId: user.UUID });
        setItems(formatProductData(response.data));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const sortListings = (sortBy) => {  // có thể là 2 sort function riêng cho Auction và Products
    window.alert(`Sorting by ${sortBy}`);
    // some sorting logic return ordered items (use setItems) (later)
  }

  const header = (activeMenuItems) => {
    switch (activeMenuItems) {
      case 'Auction':
        return 'Manage auctions';
      case 'Products':
        return 'Manage products';
      default:
        return 'Manage auctions';
    }
  }

  useEffect(() => {
    handleChangeMenuItems(activeMenuItem);
  }, [activeMenuItem]);

  return (
    <div className="flex">
      <Sidebar menuItems={menuItems} activeMenuItem={activeMenuItem} setActiveMenuItem={setActiveMenuItem} />
      <div className="w-5/6 p-6">
        <h1 className="text-2xl mb-4">{ header(activeMenuItem) }</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <FilterBar />
            <Table items={items} sortOptions={sortOptions} sortFunction={sortListings} />
          </>
        )}
      </div>
    </div>
  );
};

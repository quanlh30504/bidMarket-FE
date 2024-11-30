import React, { useState, useEffect } from 'react';
import { FilterBar } from '../components/FilterBar';
import { Table } from '../components/Table';
import { Sidebar } from '../components/Sidebar';
import AuctionService from '../../../services/auctionService';
import ProductService from '../../../services/productService';
import { useUser, ProductStatus, CategoryType, AuctionStatus } from '../../../router';
import { useNavigate } from 'react-router-dom';


export const Listings = () => {
  const [data, setData] = useState({
    auctions: [],
    products: [],
  });
  const { user } = useUser();
  const navigate = useNavigate();
  const menuItems = [
    'Auction',
    'Product'
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
        hidden_id: product.id, // Không hiển thị id
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
        hidden_id: auction.id, // Không hiển thị id
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
    if (activeMenuItem === 'Auction') {
      setItems(data.auctions);
    } else if (activeMenuItem === 'Product') {
      setItems(data.products);
    }
  }

  const refreshData = async () => {
    setLoading(true);
    try {
      const auctionResponse = await AuctionService.searchAuctions({ sellerId: user.UUID });
      const productResponse = await ProductService.searchProducts({ sellerId: user.UUID });
      console.log('Auction response:', formatAuctionData(auctionResponse.data));
      console.log('Product response:', formatProductData(productResponse.data));
      setData({
        auctions: formatAuctionData(auctionResponse.data),
        products: formatProductData(productResponse.data),
      });
      console.log('Data fetched:', data);
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
      case 'Product':
        return 'Manage products';
      default:
        return 'Manage auctions';
    }
  
  }
  useEffect(() => {
    refreshData();
  }, []);
  
  useEffect(() => {
    handleChangeMenuItems(activeMenuItem);
  }, [activeMenuItem, data]);


  return (
    <div className="flex">
      <Sidebar menuItems={menuItems} activeMenuItem={activeMenuItem} setActiveMenuItem={setActiveMenuItem} />
      <div className="w-5/6 p-6 relative">
        <h1 className="text-2xl mb-4 inline-block">{ header(activeMenuItem) }</h1>
        <button className='ml-4 align-middle' onClick={refreshData} title='Refresh'>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 12C21 16.9706 16.9706 21 12 21C9.69494 21 7.59227 20.1334 6 18.7083L3 16M3 12C3 7.02944 7.02944 3 12 3C14.3051 3 16.4077 3.86656 18 5.29168L21 8M3 21V16M3 16H8M21 3V8M21 8H16" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
        </button>
        <button className="bg-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full absolute right-6"
        onClick={() => navigate(`/seller-hub/create-${activeMenuItem === 'Auction' ? 'auction' : 'product'}`)}
        >
          Create new {activeMenuItem === 'Auction' ? 'auction' : 'product'}
        </button>   
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
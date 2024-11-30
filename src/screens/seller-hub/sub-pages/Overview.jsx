import React, { useEffect } from 'react';
import AuctionService from '../../../services/auctionService';
import OrderService from '../../../services/orderService';
import { useUser } from '../../../router/index';

export const Overview = () => {
  const user = useUser();
  const [orders, setOrders] = React.useState({
    allOrders: null,
    awaitingPayment: null,
    awaitingShipment: null,
    paidAndShipped: null,
    cancellations: null,
  });

  const [listing, setListing] = React.useState({
    auction: [],
    auctionOpen: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allOrders = (await OrderService.searchOrdersBySeller({ sellerId: user.user.UUID })).data.totalElements;
        const awaitingPayment = (await OrderService.searchOrdersBySeller({ sellerId: user.user.UUID, status: 'PENDING' })).data.totalElements;
        const awaitingShipment = (await OrderService.searchOrdersBySeller({ sellerId: user.user.UUID, status: 'SHIPPING' })).data.totalElements;
        const paidAndShipped = (await OrderService.searchOrdersBySeller({ sellerId: user.user.UUID, status: 'COMPLETED' })).data.totalElements;
        const cancellations = (await OrderService.searchOrdersBySeller({ sellerId: user.user.UUID, status: 'CANCELED' })).data.totalElements;
        setOrders({
          allOrders,
          awaitingPayment,
          awaitingShipment,
          paidAndShipped,
          cancellations,
        });

        const auction = (await AuctionService.searchAuctions({ sellerId: user.user.UUID })).data.totalElements;
        const auctionOpen = await (await AuctionService.searchAuctions({ sellerId: user.user.UUID, status: 'OPEN' })).data.totalElements;
        setListing({
          auction,
          auctionOpen
        });
      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="overview grid grid-cols-12 gap-4">
      {/* Upper section with statistics */}
      <div className="col-span-12 flex space-x-4 mb-6">
        <div className="bg-gray-100 p-4 flex-1">
          <p>Unread messages</p>
          <p className="font-bold text-xl">0</p>
        </div>
        <div className="bg-gray-100 p-4 flex-1">
          <p>Awaiting Shipment</p>
          <p className="font-bold text-xl">0</p>
        </div>
        <div className="bg-gray-100 p-4 flex-1">
          <p>Sales (31 days)</p>
          <p className="font-bold text-xl">$0.00</p>
        </div>
        <div className="bg-gray-100 p-4 flex-1">
          <p>Seller lever forecast</p>
          <p className="font-bold text-xl">Unavailable</p>
        </div>
        <div className="bg-gray-100 p-4 flex-1">
          <p>Research recommendations</p>
          <p className="font-bold text-xl">0</p>
        </div>
      </div>

      {/* Orders section */}
      <div className="col-span-6 bg-white p-4 border rounded-md">
        <h2 className="font-bold text-xl mb-4">Orders</h2>
        <div className="flex flex-col space-y-2">
          <button className="bg-gray-100 p-2 text-left">All orders {orders.allOrders}</button>
          <button className="bg-gray-100 p-2 text-left">Awaiting payment {orders.awaitingPayment}</button>
          <button className="bg-gray-100 p-2 text-left">Awaiting shipment {orders.awaitingShipment}</button>
          <button className="bg-gray-100 p-2 text-left">Paid and shipped {orders.paidAndShipped}</button>
          <button className="bg-gray-100 p-2 text-left">Cancellations {orders.cancellations}</button>
        </div>
      </div>

      {/* Sales Analysis section */}
      <div className="col-span-6 bg-white p-4 border rounded-md">
        <h2 className="font-bold text-xl mb-4">Sales Analysis</h2>
        {/* Placeholder for graph */}
        <div className="h-40 bg-gray-100"></div>
        <div className="mt-2">
          <p>Hits: 0</p>
          <p>Conversion rate: 0.00%</p>
        </div>
      </div>

      {/* Listings section */}
      <div className="col-span-6 bg-white p-4 border rounded-md">
        <h2 className="font-bold text-xl mb-4">Listings</h2>
        <button className="bg-gray-100 p-2 text-left w-full">Auction {listing.auction}</button>
        <button className="bg-gray-100 p-2 text-left w-full">Auction Open {listing.auctionOpen}</button>
      </div>

      {/* Add Listings button */}
      <div className="col-span-6 flex justify-center items-center">
        <button className="bg-gray-200 p-10 rounded-full text-gray-500">+</button>
      </div>
    </div>
  );
};
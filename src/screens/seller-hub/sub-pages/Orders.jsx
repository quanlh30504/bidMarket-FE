import React, { useState, useEffect, useCallback } from 'react';
import { FilterBar } from '../components/FilterBar';
import { Table } from '../components/Table';
import { Sidebar } from '../components/Sidebar';
import OrderService from '../../../services/orderService';
import { useUser, OrderStatus, Pagination } from '../../../router';

export const Orders = () => {
  const [selectedSortOption, setSelectedSortOption] = useState('newest');
  const { user } = useUser();
  const menuItems = [
    'All orders',
    'Awaiting payment',
    'Awaiting shipment',
    'Paid and shipped',
    'Cancellations',
  ];
  const [activeMenuItem, setActiveMenuItem] = useState('All orders');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    all: [],
    awaitingPayment: [],
    awaitingShipment: [],
    paidAndShipped: [],
    cancellations: [],
  });
  const [orderFilterAll, setOrderFilterAll] = useState({
    sellerId: user.UUID,
    bidderEmail: null,
    auctionTitle: null,
    status: null,
    page: 0,
    size: 10,
    sortBy: 'createdAt',
    sortDirection: 'DESC',
  });
  const [orderFilterAwaitingPayment, setOrderFilterAwaitingPayment] = useState({
    ...orderFilterAll,
    status: 'PENDING',
  });
  const [orderFilterAwaitingShipment, setOrderFilterAwaitingShipment] = useState({
    ...orderFilterAll,
    status: 'SHIPPING',
  });
  const [orderFilterPaidAndShipped, setOrderFilterPaidAndShipped] = useState({
    ...orderFilterAll,
    status: 'COMPLETED',
  });
  const [orderFilterCancellations, setOrderFilterCancellations] = useState({
    ...orderFilterAll,
    status: 'CANCELED',
  });
  const [orderTotalItemsAll, setOrderTotalItemsAll] = useState(0);
  const [orderTotalItemsAwaitingPayment, setOrderTotalItemsAwaitingPayment] = useState(0);
  const [orderTotalItemsAwaitingShipment, setOrderTotalItemsAwaitingShipment] = useState(0);
  const [orderTotalItemsPaidAndShipped, setOrderTotalItemsPaidAndShipped] = useState(0);
  const [orderTotalItemsCancellations, setOrderTotalItemsCancellations] = useState(0);

  const sortOptions = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'highest', label: 'Highest price' },
    { value: 'lowest', label: 'Lowest price' }
  ];

  const searchByOptions = [
    'Auction title',
  ]

  const sortOrders = (sortBy) => {
    setSelectedSortOption(sortBy);
  }

  const searchFunction = (searchByOption, value) => {
    let setter = null;
    switch (activeMenuItem) {
      case 'All orders':
        setter = setOrderFilterAll;
        break;
      case 'Awaiting payment':
        setter = setOrderFilterAwaitingPayment;
        break;
      case 'Awaiting shipment':
        setter = setOrderFilterAwaitingShipment;
        break;
      case 'Paid and shipped':
        setter = setOrderFilterPaidAndShipped;
        break;
      case 'Cancellations':
        setter = setOrderFilterCancellations;
        break;
      default:
        return;
    }
    setter((prevFilters) => ({
      ...prevFilters,
      auctionTitle: searchByOption === 'Auction title' ? value : null,
    }));
  }


  const header = (activeMenuItems) => {
    switch (activeMenuItems) {
      case 'All orders':
        return 'Manage all orders';
      case 'Awaiting payment':
        return 'Manage orders awaiting payment';
      case 'Awaiting shipment':
        return 'Manage orders awaiting shipment';
      case 'Paid and shipped':
        return 'Manage paid and shipped orders';
      case 'Cancellations':
        return 'Manage cancellations';
      default:
        return 'All orders';
    }
  }

  const formatOrderData = (response) => {
    return response.content.map(order => {
      return {
        hidden_id: order.id,
        hidden_productImageUrl: order.productImageUrl,
        hidden_paymentDueDate: order.paymentDueDate,
        auction: order.auctionTitle,
        price: `$${order.totalAmount.toFixed(2)}`,
        winner: order.userEmail,
        status: OrderStatus[order.status],
      };
    });
  }

  const fetchOrdersAll = useCallback(async () => {
    try {
      const response = await OrderService.searchOrdersBySeller(orderFilterAll);
      setData((prevData) => ({ ...prevData, all: formatOrderData(response.data) }));
      setOrderTotalItemsAll(response.data.totalElements);
    } catch (error) {
      console.error(error);
    }
  }, [orderFilterAll]);

  const fetchOrdersAwaitingPayment = useCallback(async () => {
    try {
      const response = await OrderService.searchOrdersBySeller(orderFilterAwaitingPayment);
      setData((prevData) => ({ ...prevData, awaitingPayment: formatOrderData(response.data) }));
      setOrderTotalItemsAwaitingPayment(response.data.totalElements);
    } catch (error) {
      console.error(error);
    }
  }, [orderFilterAwaitingPayment]);

  const fetchOrdersAwaitingShipment = useCallback(async () => {
    try {
      const response = await OrderService.searchOrdersBySeller(orderFilterAwaitingShipment);
      setData((prevData) => ({ ...prevData, awaitingShipment: formatOrderData(response.data) }));
      setOrderTotalItemsAwaitingShipment(response.data.totalElements);
    } catch (error) {
      console.error(error);
    }
  }, [orderFilterAwaitingShipment]);

  const fetchOrdersPaidAndShipped = useCallback(async () => {
    try {
      const response = await OrderService.searchOrdersBySeller(orderFilterPaidAndShipped);
      setData((prevData) => ({ ...prevData, paidAndShipped: formatOrderData(response.data) }));
      setOrderTotalItemsPaidAndShipped(response.data.totalElements);
    } catch (error) {
      console.error(error);
    }
  }, [orderFilterPaidAndShipped]);
  
  const fetchOrdersCancellations = useCallback(async () => {
    try {
      const response = await OrderService.searchOrdersBySeller(orderFilterCancellations);
      setData((prevData) => ({ ...prevData, cancellations: formatOrderData(response.data) }));
      setOrderTotalItemsCancellations(response.data.totalElements);
    } catch (error) {
      console.error(error);
    }
  }, [orderFilterCancellations]);

  const refreshData = async () => {
    setLoading(true);
    switch (activeMenuItem) {
      case 'All orders':
        fetchOrdersAll();
        break;
      case 'Awaiting payment':
        fetchOrdersAwaitingPayment();
        break;
      case 'Awaiting shipment':
        fetchOrdersAwaitingShipment();
        break;
      case 'Paid and shipped':
        fetchOrdersPaidAndShipped();
        break;
      case 'Cancellations':
        fetchOrdersCancellations();
        break;
      default:
        break;
    }
    setLoading(false);
  };

  const handlePageChange = async (newPage) => {
    if (activeMenuItem === 'All orders') {
      setOrderFilterAll((prevFilter) => ({ ...prevFilter, page: newPage - 1 }));
    }
    if (activeMenuItem === 'Awaiting payment') {
      setOrderFilterAwaitingPayment((prevFilter) => ({ ...prevFilter, page: newPage - 1 }));
    }
    if (activeMenuItem === 'Awaiting shipment') {
      setOrderFilterAwaitingShipment((prevFilter) => ({ ...prevFilter, page: newPage - 1 }));
    }
    if (activeMenuItem === 'Paid and shipped') {
      setOrderFilterPaidAndShipped((prevFilter) => ({ ...prevFilter, page: newPage - 1 }));
    }
    if (activeMenuItem === 'Cancellations') {
      setOrderFilterCancellations((prevFilter) => ({ ...prevFilter, page: newPage - 1 }));
    }
  };

  useEffect(() => {
    fetchOrdersAll();
  }, [fetchOrdersAll]);

  useEffect(() => {
    fetchOrdersAwaitingPayment();
  }, [fetchOrdersAwaitingPayment]);

  useEffect(() => {
    fetchOrdersAwaitingShipment();
  }, [fetchOrdersAwaitingShipment]);

  useEffect(() => {
    fetchOrdersPaidAndShipped();
  }, [fetchOrdersPaidAndShipped]);

  useEffect(() => {
    fetchOrdersCancellations();
  }, [fetchOrdersCancellations]);

  useEffect(() => {
    const handleChangeActiveMenuItem = async () => {
      switch (activeMenuItem) {
        case 'Awaiting payment':
          setItems(data.awaitingPayment);
          return;
        case 'Awaiting shipment':
          setItems(data.awaitingShipment);
          return;
        case 'Paid and shipped':
          setItems(data.paidAndShipped);
          return;
        case 'Cancellations':
          setItems(data.cancellations);
          return;
        default:
          setItems(data.all);
          return;
      }
    };
    handleChangeActiveMenuItem();
  }, [activeMenuItem, data]);

  useEffect(() => {
    let setter = null;
    switch (activeMenuItem) {
      case 'All orders':
        setter = setOrderFilterAll;
        break;
      case 'Awaiting payment':
        setter = setOrderFilterAwaitingPayment;
        break;
      case 'Awaiting shipment':
        setter = setOrderFilterAwaitingShipment;
        break;
      case 'Paid and shipped':
        setter = setOrderFilterPaidAndShipped;
        break;
      case 'Cancellations':
        setter = setOrderFilterCancellations;
        break;
      default:
        return;
    }
    switch (selectedSortOption) {
      case 'newest':
        setter((prevFilters) => ({
          ...prevFilters,
          sortField: 'createdAt',
          sortDirection: 'DESC',
        }));
        break;
      case 'oldest':
        setter((prevFilters) => ({
          ...prevFilters,
          sortField: 'createdAt',
          sortDirection: 'ASC',
        }));
        break;
      case 'highest':
        setter((prevFilters) => ({
          ...prevFilters,
          sortField: 'totalAmount',
          sortDirection: 'DESC',
        }));
        break;
      case 'lowest':
        setter((prevFilters) => ({
          ...prevFilters,
          sortField: 'totalAmount',
          sortDirection: 'ASC',
        }));
        break;
      default:
        break;
    }
  }, [selectedSortOption]);

  useEffect(() => {
    setSelectedSortOption('newest');
  }, [activeMenuItem]);

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
            <FilterBar searchByOptions={searchByOptions} searchFunction={searchFunction} />
            <Table items={items} sortOptions={sortOptions} sortFunction={sortOrders} selectedSortOption={selectedSortOption} />
            <Pagination 
              totalItems={activeMenuItem === 'All orders' ? orderTotalItemsAll : activeMenuItem === 'Awaiting payment' ? orderTotalItemsAwaitingPayment : activeMenuItem === 'Awaiting shipment' ? orderTotalItemsAwaitingShipment : activeMenuItem === 'Paid and shipped' ? orderTotalItemsPaidAndShipped : orderTotalItemsCancellations}
              itemsPerPage={orderFilterAll.size}
              pagesPerGroup={3}
              onPageChange={handlePageChange}
              currentPageByParent={activeMenuItem === 'All orders' ? orderFilterAll.page + 1 : activeMenuItem === 'Awaiting payment' ? orderFilterAwaitingPayment.page + 1 : activeMenuItem === 'Awaiting shipment' ? orderFilterAwaitingShipment.page + 1 : activeMenuItem === 'Paid and shipped' ? orderFilterPaidAndShipped.page + 1 : orderFilterCancellations.page + 1}
            />
          </>
        )}
      </div>
    </div>
  );
};

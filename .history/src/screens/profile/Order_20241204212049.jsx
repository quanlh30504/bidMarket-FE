import React, {useState, useEffect} from "react";
import { Title, Pagination } from "../../router";
import axiosClient from "../../services/axiosClient";
import { authUtils } from '../../utils/authUtils';
import { Caption } from '../../router';

export const Order = () => {
  const itemsPerPage = 5;
  const pagesPerGroup = 3; 
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const userId = authUtils.getCurrentUserId();
  

  const fetchOrders = async (page) => {
    try {
      const response = await axiosClient.get(`/api/orders/bidder`, {
        params: {
          bidderId: userId,
          page: page - 1,
          size: itemsPerPage,
          sortBy: 'createdAt',
          sortDirection: 'DESC'
        }
      });
      setOrders(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  
  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePayment = async (orderId) => {
    try {
      const response = await axiosClient.post('/api/VNPay/submitOrder', null, {
        params: {
          orderInfo: orderId,
        },
      });
      // Chuyển hướng người dùng đến URL thanh toán
      const paymentUrl = response.data.replace('redirect:', '');
      window.open(paymentUrl, '_blank');
    } catch (error) {
      console.error('Error submitting order:', error);
      // Xử lý lỗi nếu cần
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Title level={4} className="">
        Order List
        </Title>
      </div>
      
      <div className="h-px bg-gray-200 my-6" />
      
      <Table items={orders}
            handlePayment={handlePayment} />
            
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        pagesPerGroup={pagesPerGroup}
        onPageChange={handlePageChange}
      /> 
    </div>
  );
};


const Table = ({items, handlePayment}) => {
  return (
    <>
      <div className="relative overflow-x-auto rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-10 py-5">
                Image
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Payment Deadline
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
            <tr key = {index} className="bg-white border-b hover:bg-gray-50">
            <td className="px-6 py-4">
                <img className="w-20 h-20 rounded-md" src={item.productImageUrl} alt="Item" />
            </td>
              <td className="px-6 py-4">{item.auctionTitle}</td>
              <td className="px-6 py-4 text-center">${item.totalAmount}</td>
              <td className="px-6 py-4 text-center text-red-500">{item.paymentDueDate}</td>
              <td className="px-6 py-4  text-center">
              <Caption
              className={`px-3 py-1 text-sm rounded-full ${{
                  PENDING: "text-gray-700 bg-yellow-400",
                  PAID: "text-white bg-green",
                  CLOSED: "text-gray-700 bg-gray-200",
                  CANCELED: "text-red-700 bg-red-200",
                  COMPLETED: "text-blue-500 bg-slate-200",
                  EXTENDED: "text-orange-700 bg-orange-200",
                }[item.status] || "text-black bg-white" // Mặc định nếu status không khớp
                }`}
            >
              {item.status}
            </Caption>
              </td>
              <td className="px-6 py-4  text-center">
                {item.status === "PENDING" && (
                  <div className="inline-block w-24 px-2 py-1 text-sm border-2 rounded-full text-black border-black-500 text-center truncate"
                  onClick={() => handlePayment(item.id)}> Pay </div>
                )}    
              </td>
            </tr>
            ))}
          </tbody>         
        </table>
      </div>
    </>
  );
};
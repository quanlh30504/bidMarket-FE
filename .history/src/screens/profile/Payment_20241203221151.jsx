import React, {useState, useEffect} from "react";
import { Title, Pagination} from "../../router";
import axiosClient from "../../services/axiosClient";
import { authUtils } from '../../utils/authUtils';

export const Payment = () => {
  const itemsPerPage = 5;
  const pagesPerGroup = 3; 
  const [currentPage, setCurrentPage] = useState(1);
  const [payments, setPayments] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const userId = authUtils.getCurrentUserId();

  const fetchPayments = async (page) => {
    try {
      const response = await axiosClient.get(`/api/payments/user/${userId}`, {
        params: {
          page: page - 1,
          size: itemsPerPage,
          sortBy: 'createdAt',
          sortDirection: 'DESC'
        }
      });
      setPayments(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  
  useEffect(() => {
    fetchPayments(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Title level={4} className="">
          Payment History
        </Title>
      </div>
      
      <div className="h-px bg-gray-200 my-6" />
      
      <Table items = {payments}/>
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        pagesPerGroup={pagesPerGroup}
        onPageChange={handlePageChange}
      /> 
    </div>
  );
};


const Table = ({items}) => {
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
                Payment ID
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Payment Amount
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Payment Date
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
            <tr key = {index} className="bg-white border-b hover:bg-gray-50">
            <td className="px-6 py-4">
                <img className="w-20 h-20 rounded-md" src={item.productImageUrl} alt="Item" />
            </td>
              <td className="px-6 py-4">{item.title}</td>
              <td className="px-6 py-4 text-center">{item.transactionId}</td>
              <td className="px-6 py-4 text-center">${item.amount}</td>
              <td className="px-6 py-4 text-center">{item.status === 'SUCCESS' ? item.paymentDate : "N/A"}</td>
              <td className="px-6 py-4  text-center">
                 <div className={`inline-block w-24 px-2 py-1 text-sm border-2 rounded-full text-white ${item.status === 'SUCCESS' ? 'border-green bg-green' : 'border-red-500 bg-red-500'}  text-center truncate`}>
                  {item.status}
                 </div>
              </td>
            </tr>
            ))}
            </tbody>
        </table>
      </div>
    </>
  );
};
import React, {useState, useEffect} from "react";
import { Title, Pagination } from "../../router";
import axiosClient from "../../services/axiosClient";
import { authUtils } from '../../utils/authUtils';
import { Caption } from '../../router';

export const Shipping = () => {
  const itemsPerPage = 5;
  const pagesPerGroup = 3; 
  const [currentPage, setCurrentPage] = useState(1);
  const [shippings, setShippings] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const userId = authUtils.getCurrentUserId();

  const fetchShippings = async (page) => {
    try {
      const response = await axiosClient.get(`/api/shipping/buyer/${userId}`, {
        params: {
          page: page - 1,
          size: itemsPerPage,
          sortField: 'createdAt',
          sortDirection: 'DESC'
        }
      });
      setShippings(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching shippings:', error);
    }
  };

  useEffect(() => {
    fetchShippings(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Title level={4} className="">
          Shipping Information
        </Title>
      </div>
      
      <div className="h-px bg-gray-200 my-6" />
      
      <Table items={shippings} />
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
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Shop Name
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
          {items.map((item, index) => (
            <tr key={index} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4">
                <img className="w-20 h-20 rounded-md" src={item.productImageUrl} alt="Item" />
              </td>
              <td className="px-6 py-4">{item.productName}</td>
              <td className="px-6 py-4 text-center">{item.quantity}</td>
              <td className="px-6 py-4 text-center">{item.price}</td>
              <td className="px-6 py-4 text-center">{item.shopName}</td>
              <td className="px-6 py-4  text-center">
              <Caption
              className={`px-3 py-1 text-sm rounded-full ${{
                  PENDING: "text-gray-700 bg-yellow-400",
                  IN_TRANSIT: "text-blue-700 bg-blue-200",
                  DELIVERED: "text-white bg-green",
                  CANCELED: "text-red-700 bg-red-200",
                  SHIPPED: "text-blue-500 bg-slate-200",
                  EXTENDED: "text-orange-700 bg-orange-200",
                }[item.status] || "text-black bg-white" // Mặc định nếu status không khớp
                }`}
            >
              {item.status}
            </Caption>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
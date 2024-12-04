import React, {useState, useEffect} from "react";
import { Title, Pagination } from "../../router";
import axiosClient from "../../services/axiosClient";
import { authUtils } from '../../utils/authUtils';

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


const Table = (items) => {
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
                
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b hover:bg-gray-50">
            <td className="px-6 py-4">
                <img className="w-20 h-20 rounded-md" src="https://bidout-wp.b-cdn.net/wp-content/uploads/2022/10/Image-14.jpg" alt="Jeseimage" />
            </td>
              <td className="px-6 py-4">Couple Wedding Ring</td>
              <td className="px-6 py-4 text-center">1</td>
              <td className="px-6 py-4 text-center">$5</td>
              <td className="px-6 py-4 text-center">TonyStack@gmail.com</td>
              <td className="px-6 py-4 text-center">ABC</td>
              <td className="px-6 py-4  text-center">
                 <div className="inline-block w-24 px-2 py-1 text-sm border-2 rounded-full text-red-500 border-red-500 text-center truncate">Shipping</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
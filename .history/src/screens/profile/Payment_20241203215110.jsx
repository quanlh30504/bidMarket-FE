import React, {useState} from "react";
import { Title, Pagination} from "../../router";
import { IoIosSearch } from "react-icons/io";
import { payments } from "../../utils/data";
import axiosClient from "../../services/axiosClient";
import { authUtils } from '../../utils/authUtils';

export const Payment = () => {
  const itemsPerPage = 5;
  const pagesPerGroup = 3; 
  const [currentPage, setCurrentPage] = useState(1);
  
  // Pagination logic
  const totalItems = payments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = payments.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Title level={4} className="">
          Payment History
        </Title>
        <SearchBox />
      </div>
      
      <div className="h-px bg-gray-200 my-6" />
      
      <Table items = {currentItems}/>
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        pagesPerGroup={pagesPerGroup}
        onPageChange={handlePageChange}
      /> 
    </div>
  );
};

const SearchBox = () => {
  return (
    <div className="relative w-full max-w-xs">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IoIosSearch className="text-gray-500" size={16} />
      </div>
      <input 
        type="search" 
        className="w-full pl-9 pr-4 py-2 text-sm text-gray-900 rounded-lg bg-gray-50 border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search payment..."
      />
    </div>
  );
}

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
                <img className="w-20 h-20 rounded-md" src={item.image} alt="Item" />
            </td>
              <td className="px-6 py-4">{item.title}</td>
              <td className="px-6 py-4 text-center">{item.transactionId}</td>
              <td className="px-6 py-4 text-center">${item.amount}</td>
              <td className="px-6 py-4 text-center">{item.status === 'Success' ? item.paymentDate : "N/A"}</td>
              <td className="px-6 py-4  text-center">
                 <div className={`inline-block w-24 px-2 py-1 text-sm border-2 rounded-full text-white ${item.status === 'Success' ? 'border-green bg-green' : 'border-red-500 bg-red-500'}  text-center truncate`}>
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
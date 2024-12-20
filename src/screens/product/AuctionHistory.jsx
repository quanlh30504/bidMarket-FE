import { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import axiosClient from "../../services/axiosClient";
import { Pagination } from "../../components/pagination";

export const AuctionHistory = ({
    auctionId,
    startingPrice,
    currentUserId,
    winnerName,
    bids,
    setBids
  }) => {
    // const [bids, setBids] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10; // Số lượng item mỗi trang
    const pagesPerGroup = 5; // Số lượng trang mỗi nhóm
  
    const fetchBids = async (page) => {
      try {
        const response = await axiosClient.get(`/api/bids/auction/${auctionId}`, {
          params: {
            page: page - 1, // API nhận page từ 0
            size: itemsPerPage,
            status: "VALID",
            sortField: "bidTime",
            direction: "DESC",
          },
        });
        const data = response.data;
        setBids(data.content);
        setTotalItems(data.totalElements);
      } catch (error) {
        console.error("Error fetching auction bids:", error);
      }
    };
  
    useEffect(() => {
      fetchBids(1); // Gọi dữ liệu trang đầu tiên
    }, [auctionId]);
  
  
    return (
      <div className="shadow-s1 p-8 rounded-lg bg-white">
        <h5 className="text-lg font-normal">Auction History</h5>
        {winnerName && (
          <div className="flex items-center mt-4 text-green-600">
            <FaCheckCircle className="mr-2" size={25} />
            <span className="text-sm">
              Congratulations {winnerName}, you are the winner!
            </span>
          </div>
        )}
        <hr className="my-5" />
  
        <div className="relative overflow-x-auto rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-5">
                  Bidder
                </th>
                <th scope="col" className="px-6 py-3">
                  Bid Amount
                </th>
                <th scope="col" className="px-6 py-3">
                  Bid Time
                </th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid, index) => (
                <tr
                  key={index}
                  className={`bg-white border-b hover:bg-gray-50 ${bid.userId === currentUserId
                    ? "text-blue-500 font-medium"
                    : ""
                    }`}
                >
                  <td className="px-6 py-4">
                    {bid.userId === currentUserId ? "You" : bid?.userEmail}
                  </td>
                  <td className="px-6 py-4">
                    US ${bid.bidAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(bid.bidTime).toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-6 py-4">Startting price</td>
                <td className="px-6 py-4">US ${startingPrice}</td>
                <td className="px-6 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
  
        {/* Pagination */}
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          pagesPerGroup={pagesPerGroup}
          onPageChange={fetchBids}
          className="mt-4"
          buttonClassName="bg-blue-500 text-white hover:bg-blue-700"
        />
      </div>
    );
  };
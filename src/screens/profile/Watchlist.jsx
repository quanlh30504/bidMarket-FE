import { Title } from "../../router";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { RiAuctionFill } from "react-icons/ri";

export const Watchlist = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Title level={4} className="">
          My Watchlist
        </Title>
        <SearchBox />
      </div>
      
      <div className="h-px bg-gray-200 my-6" />
      
      <Table />
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
        placeholder="Search auction..."
      />
    </div>
  );
}

const Table = () => {
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
                Current Bid
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Your Bid
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Time Left
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b hover:bg-gray-50">
            <td className="px-6 py-4">
                <img className="w-20 h-20 rounded-md" src="https://bidout-wp.b-cdn.net/wp-content/uploads/2022/10/Image-14.jpg" alt="Jeseimage" />
            </td>
              <td className="px-6 py-4">Couple Wedding Ring</td>
              <td className="px-6 py-4 text-center">$500</td>
              <td className="px-6 py-4 text-center">$500</td>
              
              <td className="px-6 py-4  text-center">
                 <div className="inline-block w-24 px-2 py-1 text-sm border-2 rounded-full text-green border-emerald-500 text-center truncate  rounded-full">Winning</div>
              </td>
              <td className="px-6 py-4 text-center text-red-500">1d 11h 27m</td>
              <td className="px-6 py-4 text-center flex items-center gap-3 mt-5">
              <button>
                <RiAuctionFill size={24} className="font-medium text-green" />
              </button>
                <button className="font-medium text-red-500">
                  <MdOutlineDeleteOutline size={27} />
                </button>
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr className="bg-white border-b hover:bg-gray-50">
            <td className="px-6 py-4">
                <img className="w-20 h-20 rounded-md" src="https://bidout-wp.b-cdn.net/wp-content/uploads/2022/10/Image-14.jpg" alt="Jeseimage" />
            </td>
              <td className="px-6 py-4">Couple Wedding Ring</td>
              <td className="px-6 py-4 text-center">$1000</td>
              <td className="px-6 py-4 text-center">$500</td>
              
              <td className="px-6 py-4  text-center">
                 <div className="inline-block w-24 px-2 py-1 text-sm border-2 rounded-full text-red-500 border-red-500 text-center truncate rounded-full">Out Bid</div>
              </td>
              <td className="px-6 py-4 text-center text-red-500">1d 11h 27m</td>
              <td className="px-6 py-4 text-center flex items-center gap-3 mt-5">
              <button>
                <RiAuctionFill size={24} className="font-medium text-green" />
              </button>
                <button className="font-medium text-red-500">
                  <MdOutlineDeleteOutline size={27} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
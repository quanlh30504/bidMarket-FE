import React from "react";
import { AuctionStatus, ProductStatus, OrderStatus } from "../../../router/index";
import { ActionButton, AuctionButtonTypes } from "./ActionButton";

const StatusBadge = ({ item }) => {
  const { status } = item;
  const statusColor = {
    [AuctionStatus.OPEN]: "bg-green text-white",
    [AuctionStatus.PENDING]: "bg-yellow-500 text-yellow-100",
    [AuctionStatus.CANCELED]: "bg-red-800 text-red-100",
    [AuctionStatus.CLOSED]: "bg-gray-500 text-gray-100",
    [AuctionStatus.COMPLETED]: "bg-blue-500 text-blue-100",
  };
  return (
    <div className={`min-h-[70px] flex flex-col items-center justify-center`}>
      <span className={`px-2 py-1 rounded-full text-center ${statusColor[status]}`} style={{ display: 'inline-block', width: '100px' }}>
        {status}
      </span>
      <div className="flex flex-col items-center justify-center">
        {status === AuctionStatus.PENDING && (
          <div className="flex mt-1 justify-center">
            <ActionButton type={AuctionButtonTypes.REVIEW_AUCTION} item={item} />
          </div>
        )}
        {status === AuctionStatus.OPEN && (
          <div className="flex mt-1 justify-center">
            <ActionButton type={AuctionButtonTypes.CANCEL_AUCTION} item={item} />
          </div>
        )}
      </div>
    </div>
  );
}

const CategoriesBadge = ({ categories }) => {
  return (
    <div className="flex flex-wrap justify-center">
      {categories.map((category, index) => (
        <span key={index} className="px-2 py-1 bg-yellow-200 text-gray-800 rounded-full text-center ml-2 my-1">
          {category}
        </span>
      ))}
    </div>
  );
}

export const TableItem = ({ item }) => {
  const { ...fields } = item;

  return (
    <tr className="mt-2 border-t border-b">
      {Object.entries(fields)
      .filter(([key]) => !key.startsWith('hidden_'))
      .map(([key, value], index) => (
        <td key={index} className="p-2">
          {key === 'status' ? (
            <StatusBadge item={item} />
          ) : key === 'categories' ? (
            <CategoriesBadge categories={value} />
          ) : (
            value
          )}
        </td>
      ))}
    </tr>
  );
};

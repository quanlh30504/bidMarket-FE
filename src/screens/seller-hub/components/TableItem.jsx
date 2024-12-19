import React from "react";
import { AuctionStatus, ProductStatus, OrderStatus, AccountStatus } from "../../../router/index";
import { ActionButton, ActionButtonTypes, ActionButtonAdmin, ActionButtonTypesAdmin } from "./ActionButton";

const StatusBadge = ({ item }) => {
  const { status } = item;
  const statusColor = {
    [OrderStatus.PENDING]: "bg-red-500 text-red-100",
    [OrderStatus.SHIPPING]: "bg-gray-200 text-red-500",
    [AuctionStatus.OPEN]: "bg-green text-white",
    [AuctionStatus.PENDING]: "bg-yellow-500 text-yellow-100",
    [AuctionStatus.CANCELED]: "bg-red-800 text-red-100",
    [AuctionStatus.CLOSED]: "bg-gray-500 text-gray-100",
    [AuctionStatus.COMPLETED]: "bg-blue-500 text-blue-100",
    [ProductStatus.ACTIVE]: "bg-green text-white",
    [ProductStatus.INACTIVE]: "bg-red-800 text-red-100",
    [ProductStatus.SOLD]: "bg-yellow-500 text-yellow-100",
    [AuctionStatus.READY]: "bg-green text-white",
  };
  return (
    <div className={`min-h-[70px] flex flex-col items-center justify-center`}>
      <span className={`px-2 py-1 rounded-full text-center ${statusColor[status]}`} style={{ display: 'inline-block', width: '100px' }}>
        {status}
      </span>
      <div className="flex flex-col items-center justify-center">
        {status === AuctionStatus.CANCELED && (
          <ActionButton type={ActionButtonTypes.REOPEN} item={item} />
        )}
        {status === AuctionStatus.PENDING && (
          <div className="flex mt-1 justify-center">
            <ActionButton type={ActionButtonTypes.EDIT} item={item} />
            <ActionButton type={ActionButtonTypes.DELETE} item={item} />
          </div>
        )}
        {status === AuctionStatus.COMPLETED && (
          <div className="flex mt-1 justify-center">
            <ActionButton type={ActionButtonTypes.DELETE} item={item} />
          </div>
        )}
        {status === ProductStatus.INACTIVE && (
          <div className="flex mt-1 justify-center">
            <ActionButton type={ActionButtonTypes.EDIT} item={item} />
            <ActionButton type={ActionButtonTypes.DELETE} item={item} />
            <ActionButton type={ActionButtonTypes.CREATE_AUCTION} item={item} />
          </div>
        )}
        {status === ProductStatus.SOLD && (
          <div className="flex mt-1 justify-center">
            <ActionButton type={ActionButtonTypes.DELETE} item={item} />
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

const StatusBadgeAdmin = ({ item }) => {
  const { status } = item;
  const statusColor = {
    [AuctionStatus.OPEN]: "bg-green text-white",
    [AuctionStatus.PENDING]: "bg-yellow-500 text-yellow-100",
    [AuctionStatus.CANCELED]: "bg-red-800 text-red-100",
    [AuctionStatus.CLOSED]: "bg-gray-500 text-gray-100",
    [AuctionStatus.COMPLETED]: "bg-blue-500 text-blue-100",
    [AuctionStatus.READY]: "bg-green text-white",
    [AccountStatus.VERIFIED]: "bg-green text-white",
    [AccountStatus.UNVERIFIED]: "bg-yellow-500 text-yellow-100",
    [AccountStatus.BANNED]: "bg-red-800 text-red-100",
  };
  return (
    <div className={`min-h-[70px] flex flex-col items-center justify-center`}>
      <span className={`px-2 py-1 rounded-full text-center ${statusColor[status]}`} style={{ display: 'inline-block', width: '100px' }}>
        {status}
      </span>
      <div className="flex flex-col items-center justify-center">
        {status === AuctionStatus.PENDING && (
          <div className="flex mt-1 justify-center">
            <ActionButtonAdmin type={ActionButtonTypesAdmin.REVIEW_AUCTION} item={item} />
          </div>
        )}
        {(status === AuctionStatus.OPEN || status === AuctionStatus.READY) && (
          <div className="flex mt-1 justify-center">
            <ActionButtonAdmin type={ActionButtonTypesAdmin.CANCEL_AUCTION} item={item} />
            <ActionButtonAdmin type={ActionButtonTypesAdmin.CLOSE_AUCTION} item={item} />
          </div>
        )}
        {(status === AccountStatus.UNVERIFIED || status === AccountStatus.VERIFIED) && (
          <div className="flex mt-1 justify-center">
            <ActionButtonAdmin type={ActionButtonTypesAdmin.BAN_USER} item={item} />
          </div>
        )}
        {status === AccountStatus.BANNED && (
          <div className="flex mt-1 justify-center">
            <ActionButtonAdmin type={ActionButtonTypesAdmin.UNBAN_USER} item={item} />
          </div>
        )}
      </div>
    </div>
  );
}

export const TableItem = ({ item, isAdmin = false }) => {
  const { ...fields } = item;
  const { hidden_thumbnailUrl } = item;

  return (
    <tr className="mt-2 border-t border-b">
      {Object.entries(fields)
        .filter(([key]) => !key.startsWith('hidden_'))
        .map(([key, value], index) => (
          <td key={index} className="p-2">
            {key === 'status' ? (
              isAdmin ? <StatusBadgeAdmin item={item} /> : <StatusBadge item={item} />
            ) : key === 'categories' ? (
              <CategoriesBadge categories={value} />
            ) : key === 'auction' || key === 'product' ? (
              <div className="flex items-center">
                <div className="mr-4 w-20 h-20">
                  <img
                    src={hidden_thumbnailUrl || 'https://placehold.co/80x80/png?text=No+Image'}
                    alt={`${key} thumbnail`}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <span>{value}</span>
              </div>
            ) : (
              value
            )}
          </td>
        ))}
    </tr>
  );
};

import React from 'react';

export const DeleteWarning = ({ item, type }) => {
  if (!item) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-red-600 text-center mb-4">
        Are you sure you want to delete this {type}?
      </h2>
      <div className="mb-4 text-center text-xl">
        <p className="text-gray-700">You are about to delete:</p>
        <p className="text-green text-center">
          {type === 'product' ? item.product : item.auction} {/* name */}
        </p>
        <p className="text-gray-700">
          ID: <span className="font-medium">{item.hidden_id}</span> {/* id */}
        </p>
      </div>
    </div>
  );
};

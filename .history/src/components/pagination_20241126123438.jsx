// Pagination.js
import React, { useState } from "react";

export const Pagination = ({ totalItems, itemsPerPage, pagesPerGroup, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentGroup = Math.ceil(currentPage / pagesPerGroup);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    onPageChange(newPage);
  };

  const handlePreviousGroup = () => {
    if (startPage > 1) {
      const newPage = startPage - 1;
      setCurrentPage(newPage);
      onPageChange(newPage);
    }
  };

  const handleNextGroup = () => {
    if (endPage < totalPages) {
      const newPage = endPage + 1;
      setCurrentPage(newPage);
      onPageChange(newPage);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={handlePreviousGroup}
        disabled={startPage === 1}
        className="px-4 py-2 mx-1 bg-gray-300 rounded"
      >
        Prev
      </button>

      {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
        const page = startPage + index;
        return (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 mx-1 ${
              page === currentPage ? "bg-emerald-500 text-white" : "bg-gray-300"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={handleNextGroup}
        disabled={endPage === totalPages}
        className="px-4 py-2 mx-1 bg-gray-300 rounded"
      >
        Next
      </button>
    </div>
  );
};


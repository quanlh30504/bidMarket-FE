// Pagination.js
import React, { useState, useEffect } from "react";

export const Pagination = ({
  totalItems,
  itemsPerPage,
  pagesPerGroup,
  onPageChange,
  currentPageByParent=null,
  className = "", 
  buttonClassName = "", // Thêm props để tùy chỉnh class của các button
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentGroup = Math.ceil(currentPage / pagesPerGroup);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  // Khi thay đổi currentPage, gọi hàm onPageChange
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

  const pageButtons = [];

  if (startPage > 1) {
    pageButtons.push(
      <button
        key="prev-ellipsis"
        disabled
        className={`px-4 py-2 mx-1 rounded bg-gray-300 ${buttonClassName}`}
      >
        ...
      </button>
    );
  }

  for (let page = startPage; page <= endPage; page++) {
    pageButtons.push(
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={`px-4 py-2 mx-1 rounded ${
          page === currentPage ? "bg-emerald-500 text-white" : "bg-gray-300"
        } ${buttonClassName}`}
      >
        {page}
      </button>
    );
  }

  if (endPage < totalPages) {
    pageButtons.push(
      <button
        key="next-ellipsis"
        disabled
        className={`px-4 py-2 mx-1 rounded bg-gray-300 ${buttonClassName}`}
      >
        ...
      </button>
    );
  }

  useEffect(() => {
    if (currentPageByParent !== null) {
      console.log("currentPageByParent", currentPageByParent);
      setCurrentPage(currentPageByParent);
    }
  }, [currentPageByParent]);

  return (
    <div className={`flex justify-center mt-4 ${className}`}>
      {/* Nút Previous Group */}
      <button
        onClick={handlePreviousGroup}
        disabled={startPage === 1}
        className={`px-4 py-2 mx-1 rounded ${
          startPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-300"
        } ${buttonClassName}`}
      >
        Prev
      </button>

      {/* Các nút trang với dấu "..." nếu cần */}
      {pageButtons}

      {/* Nút Next Group */}
      <button
        onClick={handleNextGroup}
        disabled={endPage === totalPages}
        className={`px-4 py-2 mx-1 rounded ${
          endPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-gray-300 "
        } ${buttonClassName}`}
      >
        Next
      </button>
    </div>
  );
};

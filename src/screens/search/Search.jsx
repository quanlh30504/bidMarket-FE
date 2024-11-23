import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import { Container, PrimaryButton } from "../../router";
import { Pagination } from "../../components/pagination";
import { ProductCard } from "../../components/cards/ProductCard";
import { IoIosSearch } from "react-icons/io";
import { commonClassNameOfInput } from "../../components/common/Design";
import { categoryMapping, statusMapping, sortByMapping } from "./filterMapping";

export const SearchList = () => {
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title") || ""; // Lấy title từ URL

  const [searchResults, setSearchResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState({
    title: title,
    categoryType: [],
    status: null,
    minPrice: null,
    maxPrice: null,
    sortField: "currentPrice",
    sortDirection: "ASC",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    size: 12, // Matches `itemsPerPage` in Pagination component
  });

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        // Chuyển đổi filters.categoryType thành chuỗi phù hợp

        const categoryType = filters.categoryType
          .map((item) => categoryMapping[item])
          .join(",");

        const params = {
          ...filters,
          categoryType,
          sortField: sortByMapping[filters.sortField] || filters.sortField,
          page: pagination.page - 1, // Adjust for zero-based pagination
          size: pagination.size,
        };

        // Tạo URL với encoding
        const queryString = Object.keys(params)
          .filter((key) => params[key] !== null && params[key] !== "") // Bỏ qua null hoặc rỗng
          .map((key) => `${key}=${encodeURIComponent(params[key])}`)
          .join("&");
        // console.log("queryString: " + queryString);

        const response = await axiosClient.get(
          `/api/auctions/search?${queryString}`
        );
        setSearchResults(response.data.content);

        setTotalResults(response.data.totalElements);
        console.log(searchResults);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [filters, pagination]);

  const handleSearch = (key, value) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev, [key]: value };
      
      // Kiểm tra nếu key là minPrice hoặc maxPrice, đảm bảo logic hợp lệ
      if (key === "minPrice" && updatedFilters.maxPrice !== null && value !== "") {
        if (Number(value) > Number(updatedFilters.maxPrice)) {
          alert("Min price không được lớn hơn Max price.");
          return prev; // Không cập nhật filter
        }
      }
      if (key === "maxPrice" && updatedFilters.minPrice !== null && value !== "") {
        if (Number(value) < Number(updatedFilters.minPrice)) {
          alert("Max price không được nhỏ hơn Min price.");
          return prev; // Không cập nhật filter
        }
      }
  
      return updatedFilters;
    });
  };
  
  const toggleStatusFilter = (status) => {
    setFilters((prev) => {
      return {
        ...prev,
        status: prev.status === status ? null : status, // Dùng null thay cho giá trị trống
      };
    });
  };

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  

  const toggleFilter = (filter) => {
    setFilters((prev) => {
      const isFilterSelected = prev.categoryType.includes(filter);
      return {
        ...prev,
        categoryType: isFilterSelected
          ? prev.categoryType.filter((item) => item !== filter) // Loại bỏ
          : [...prev.categoryType, filter], // Thêm
      };
    });
  };

  // Hàm bổ sung: Reset tất cả bộ lọc
  const clearFilters = () => {
    setFilters({
      categoryType: [],
      status: null,
      minPrice: null,
      maxPrice: null,
      sortField: "currentPrice",
      sortDirection: "ASC",
    });
    console.log(filters)
  };

  const category = [
    "All",
    "Electronics",
    "Fashion",
    "Collectibles",
    "Home appliances",
    "Sports equipment",
    "Toys and games",
    "Vehicles",
    "Real estate",
    "Art and crafts",
    "Jewelry and accessories",
    "Health and beauty",
    "Garden and outdoors",
    "Music instruments",
    "Pet supplies",
    "Office supplies",
  ];

  const status = [
    "PENDING",
    "READY",
    "OPEN",
    "CLOSED",
    "COMPLETED",
    "CANCELLED",
  ];

  const sortByTime = ["Newly listed", "Ending soonest"];

  return (
    <div className="pt-16 relative">
      <div className="bg-[#241C37] pt-8 h-[40vh] flex items-center justify-center">
        <Container className="flex justify-center">
          <div className="w-full md:w-1/2 text-white pr-12">
            <SearchBox
              onSearch={(title) => handleSearch("title", title)}
              title={title}
            />
          </div>
        </Container>
      </div>
      <section className="product-home">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 my-8">
            {/* Filters */}
            <div className="md:col-span-1">
              <div className="p-4 shadow-md bg-white rounded-lg">
                {/* Category */}
                <FilterSection
                  title="Category"
                  filters={category}
                  selectedFilters={filters.categoryType}
                  onFilterToggle={toggleFilter}
                />

                {/* Status */}
                <FilterSection
                  title="Status"
                  filters={status}
                  selectedFilters={[filters.status].filter(Boolean)}
                  onFilterToggle={toggleStatusFilter}
                  isSingleSelection={true} // Chỉ cho phép chọn một
                />

                {/* Price */}
                <h3 className="text-lg font-semibold mb-4">Price</h3>
                <div>
                  <div>Min price:</div>
                  <input
                    className={commonClassNameOfInput}
                    type="number"
                    value={filters.minPrice}
                    placeholder="$"
                    min={0} // Giá trị nhỏ nhất là 0
                    onBlur={(e) => handleSearch("minPrice", e.target.value)}
                  />
                  <div>Max price:</div>
                  <input
                    className={commonClassNameOfInput}
                    type="number"
                    value={filters.maxPrice}
                    placeholder="$"
                    min={0} // Giá trị nhỏ nhất là 0
                    onBlur={(e) => handleSearch("maxPrice", e.target.value)}
                  />
                </div>

                <div className="h-px bg-gray-200 my-6" />

                {/* <FilterSection
                  title="Sort by"
                  filters={sortByTime}
                  selectedFilters={[filters.sortField]}
                  onFilterToggle={(sortField) =>
                    handleSearch("sortField", sortField)
                  }
                /> */}

                <PrimaryButton className="ml-3" onClick={clearFilters}>
                  Clear Filters
                </PrimaryButton>
              </div>
            </div>

            {/* Products */}
            <div className="md:col-span-3">
              <h4 className="text-lg font-semibold mb-4">
                {totalResults} results
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {searchResults.map((item, index) => (
                  <ProductCard item={item} key={index} />
                ))}
              </div>
              <Pagination
                totalItems={totalResults}
                itemsPerPage={pagination.size}
                pagesPerGroup={3}
                onPageChange={(page) =>
                  setPagination((prev) => ({ ...prev, page }))
                }
              />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
const SearchBox = ({ onSearch, title }) => {
  const [searchTerm, setSearchTerm] = useState(title);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit}>
      <div className="relative">
        <div className="absolute inset-y-0 start-2 flex items-center ps-3 pointer-events-none">
          <IoIosSearch color="black" size={25} />
        </div>
        <input
          type="search"
          className="block shadow-md w-full p-6 ps-16 text-sm text-gray-800 rounded-full bg-gray-50 outline-none"
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <PrimaryButton className="absolute end-2.5 bottom-2" type="submit">
          Search
        </PrimaryButton>
      </div>
    </form>
  );
};

// const FilterSection = ({ title, filters, selectedFilters, onFilterToggle }) => (
//   <div>
//     <h3 className="text-lg font-semibold mb-4">{title}</h3>
//     <div>
//       {filters.map((filter) => (
//         <div key={filter}>
//           <a
//             onClick={(e) => {
//               e.preventDefault();
//               onFilterToggle(filter);
//             }}
//             className={`text-[15px] font-[500] text-gray_100 cursor-pointer list-none hover:text-green transition-all ease-in-out ${
//               selectedFilters.includes(filter) ? "text-green" : ""
//             }`}
//           >
//             {filter}
//           </a>
//         </div>
//       ))}
//     </div>
//     <div className="h-px bg-gray-200 my-6" />
//   </div>
// );
const FilterSection = ({
  title,
  filters,
  selectedFilters,
  onFilterToggle,
  isSingleSelection,
}) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div>
      {filters.map((filter) => (
        <div key={filter} className="flex items-center mb-2">
          <input
            type={"checkbox"} // Sử dụng radio nếu chọn duy nhất
            id={filter}
            checked={selectedFilters.includes(filter)}
            onChange={() => onFilterToggle(filter)}
          />
          <label
            htmlFor={filter}
            className={`ml-2 text-[15px] font-[500] text-gray_100 cursor-pointer ${
              selectedFilters.includes(filter) ? "text-green" : ""
            }`}
          >
            {filter}
          </label>
        </div>
      ))}
    </div>
    <div className="h-px bg-gray-200 my-6" />
  </div>
);

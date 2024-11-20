import React, { useEffect, useState } from "react";
import axiosClient from "../../services/axiosClient";
import { Container, PrimaryButton } from "../../router";
import { Pagination } from "../../components/pagination";
import { ProductCard } from "../../components/cards/ProductCard";
import { IoIosSearch } from "react-icons/io";
import { commonClassNameOfInput } from "../../components/common/Design";
import { categoryMapping, statusMapping, sortByMapping } from "./filterMapping";

export const SearchList = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState({
    title: "",
    categoryType: [],
    status: "",
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

        const categoryType = filters.categoryType.map((item) => categoryMapping[item]).join(",");
  
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
  
        const response = await axiosClient.get(`/api/auctions/search?${queryString}`);
        setSearchResults(response.data.content);
        setTotalResults(response.data.totalElements);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
  
    fetchSearchResults();
  }, [filters, pagination]);

  const handleSearch = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleFilter = (filter) => {
    setFilters((prev) => ({
      ...prev,
      categoryType: prev.categoryType.includes(filter)
        ? prev.categoryType.filter((item) => item !== filter)
        : [...prev.categoryType, filter],
    }));
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

  const status = ["Pending", "Ready", "Open", "Closed", "Cancelled"];
  const sortByTime = ["Newly listed", "Ending soonest"];

  return (
    <div className="pt-16 relative">
      <div className="bg-[#241C37] pt-8 h-[40vh] flex items-center justify-center">
        <Container className="flex justify-center">
          <div className="w-full md:w-1/2 text-white pr-12">
            <SearchBox onSearch={(title) => handleSearch("title", title)} />
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
                  selectedFilters={[filters.status]}
                  onFilterToggle={(status) => handleSearch("status", status)}
                />

                {/* Price */}
                <h3 className="text-lg font-semibold mb-4">Price</h3>
                <div>
                  <div>Min price:</div>
                  <input
                    className={commonClassNameOfInput}
                    type="number"
                    placeholder="VND"
                    onBlur={(e) => handleSearch("minPrice", e.target.value)}
                  />
                  <div>Max price:</div>
                  <input
                    className={commonClassNameOfInput}
                    type="number"
                    placeholder="VND"
                    onBlur={(e) => handleSearch("maxPrice", e.target.value)}
                  />
                </div>
                <div className="h-px bg-gray-200 my-6" />

                {/* Sort by time */}
                <FilterSection
                  title="Sort by time"
                  filters={sortByTime}
                  selectedFilters={[filters.sortField]}
                  onFilterToggle={(sortField) =>
                    handleSearch("sortField", sortField)
                  }
                />

                <PrimaryButton className="ml-3">More filters</PrimaryButton>
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
                onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
              />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

const SearchBox = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
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

const FilterSection = ({ title, filters, selectedFilters, onFilterToggle }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div>
      {filters.map((filter) => (
        <div key={filter}>
          <a
            onClick={(e) => {
              e.preventDefault();
              onFilterToggle(filter);
            }}
            className={`text-[15px] font-[500] text-gray_100 cursor-pointer list-none hover:text-green transition-all ease-in-out ${
              selectedFilters.includes(filter) ? "text-green" : ""
            }`}
          >
            {filter}
          </a>
        </div>
      ))}
    </div>
    <div className="h-px bg-gray-200 my-6" />
  </div>
);

import React, { useState } from 'react';
import { Container, PrimaryButton, CustomNavLink, Pagination} from "../../router";
import { productlists } from "../../utils/data";
import { ProductCard } from "../../components/cards/ProductCard";
import { IoIosSearch } from "react-icons/io";
import { commonClassNameOfInput } from "../../components/common/Design";

export const SearchList = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) => 
      prev.includes(filter) 
        ? prev.filter((item) => item !== filter) 
        : [...prev, filter]
    );
  };

  const category = [
    'All',
    'Electronics',
    'Fashion',
    'Collectibles',
    'Home appliances',
    'Sports equipment',
    'Toys and games',
    'Vehicles',
    'Real estate',
    'Art and crafts',
    'Jewelry and accessories',
    'Health and beauty',
    'Garden and outdoors',
    'Music instruments',
    'Pet supplies',
    'Office supplies'
];

  const status = ['Pending', 'Open', 'Closed', 'Cancelled'];
  const sortByTime =['Newly listed', 'Ending soonest'];

  const ITEMS_PER_PAGE = 12; 
  const PAGES_PER_GROUP = 3; 

  const [currentPage, setCurrentPage] = useState(1);
  
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
  
    const paginatedProducts = productlists.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

  return (
    
    <>
        <div className="pt-16 relative">
        <div className="bg-[#241C37] pt-8 h-[40vh] relative content flex items-center justify-center">
          <Container className="flex justify-center">
          <div className="w-full md:w-1/2 text-white pr-12">
            <SearchBox />
            </div>
          </Container>
        </div>
       <section className="product-home">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 my-8">
            {/* Cột filter bên trái */}
            <div className="md:col-span-1">
              <div className="p-4 shadow-md bg-white rounded-lg">
                {/* Category */}
                <FilterSection
                    title="Category"
                    filters={category}
                    selectedFilters={selectedFilters}
                    onFilterToggle={toggleFilter}
                  />

              {/* Status */}
              <FilterSection
                    title="Status"
                    filters={status}
                    selectedFilters={selectedFilters}
                    onFilterToggle={toggleFilter}
                  />

          <h3 className="text-lg font-semibold mb-4">Price</h3>
          <div>
              <div>Min price:</div>
              <input className={commonClassNameOfInput} type="number" name="" placeholder='VND' />
              <div>Max price:</div>
              <input className={commonClassNameOfInput} type="number" name="" placeholder='VND' />
            </div>
                <div className="h-px bg-gray-200 my-6" />

                {/* Sort by time*/}
              <FilterSection
                    title="Sort by time"
                    filters={sortByTime}
                    selectedFilters={selectedFilters}
                    onFilterToggle={toggleFilter}
                  />

                <PrimaryButton className="ml-3">More filters</PrimaryButton>
              </div>
            </div>

            {/* Cột chứa danh sách sản phẩm */}
            <div className="md:col-span-3">
            <h4 className="text-lg font-semibold mb-4">
               {productlists?.length} results
            </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {paginatedProducts?.map((item, index) => (
                  <ProductCard item={item} key={index + 1} />
                ))}
              </div>
              <Pagination
        totalItems={productlists.length}
        itemsPerPage={ITEMS_PER_PAGE}
        pagesPerGroup={PAGES_PER_GROUP}
        onPageChange={handlePageChange}
      />
            </div>
          </div>
        </Container>
      </section>
      </div>
    </>
  );
};

const SearchBox = () => {
  return (
    <>
      <form className="">
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-800 sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-2 flex items-center ps-3 pointer-events-none">
            <IoIosSearch color="black" size={25} />
          </div>
          <input type="search" id="default-search" className="block shadow-md w-full p-6 ps-16 text-sm text-gray-800 rounded-full bg-gray-50 outline-none" placeholder="Search product..." />
          <CustomNavLink href="/search">
          <PrimaryButton className="absolute end-2.5 bottom-2">Search</PrimaryButton>
            </CustomNavLink>
        </div>
      </form>
    </>
  );
};

const FilterSection = ({ title, filters, selectedFilters, onFilterToggle, className ='' }) => {
  return (
    <>
      <div className={className}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div>
        {filters.map((filter) => (
          <div key={filter}>
            <a
                onClick={(e) => {
                  e.preventDefault(); // Ngăn hành động mặc định
                  onFilterToggle(filter);
                }}
                className={`text-[15px] font-[500] text-gray_100 cursor-pointer list-none hover:text-green transition-all ease-in-out ${selectedFilters.includes(filter) ? 'text-green' : ''}`}
                href="/search"
              >
                {filter}
              </a>
            </div>
            ))}
                </div>
      <div className="h-px bg-gray-200 my-6" />
      </div>
    </>
  );
};
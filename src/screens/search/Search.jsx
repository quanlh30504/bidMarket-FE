import React, { useState } from 'react';
import { Container, PrimaryButton, CustomNavLink} from "../../router";
import { productlists } from "../../utils/data";
import { ProductCard } from "../../components/cards/ProductCard";
import { IoIosSearch } from "react-icons/io";


export const SearchList = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) => 
      prev.includes(filter) 
        ? prev.filter((item) => item !== filter) 
        : [...prev, filter]
    );
  };

  const filters = ['Filter 1', 'Filter 2', 'Filter 3'];
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
                {/* Nội dung bộ lọc */}
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                <div>
                {filters.map((filter) => (
              <div key={filter}>
              <a
                onClick={(e) => {
                  e.preventDefault(); // Ngăn hành động mặc định
                  toggleFilter(filter);
                }}
                className={`text-black text-[17px] font-medium cursor-pointer list-none hover:text-green transition-all ease-in-out ${selectedFilters.includes(filter) ? 'text-green' : ''}`}
                href="/search"
              >
                {filter}
              </a>
            </div>
            ))}
                </div>
              </div>
            </div>

            {/* Cột chứa danh sách sản phẩm */}
            <div className="md:col-span-3">
            <h4 className="text-lg font-semibold mb-4">
               {productlists?.length} results
            </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {productlists?.slice(0, 12)?.map((item, index) => (
                  <ProductCard item={item} key={index + 1} />
                ))}
              </div>
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
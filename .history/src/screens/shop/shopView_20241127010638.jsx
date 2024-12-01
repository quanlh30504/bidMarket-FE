import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ProductCard } from "../../components/cards/ProductCard";
import { productlists } from "../../utils/data";
import { Container, Heading, PrimaryButton, CustomNavLink, Pagination, Title, Caption, ProfileCard} from "../../router";
import { User2 } from "../../components/hero/Hero";
import { CiShop, CiStar, CiLocationOn } from "react-icons/ci";
import { LuPackageCheck } from "react-icons/lu";
import { GoPeople } from "react-icons/go";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

export const ShopView = () => {
  const ITEMS_PER_PAGE = 12; 
  const PAGES_PER_GROUP = 3; 

  const { sellerId } = useParams();
  const [sellerData, setSellerData] = useState(null);
   
  const [currentPage, setCurrentPage] = useState(1);
  
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
  
    const paginatedProducts = productlists.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
    // sellerId = 'edf0a2f6-7a29-45e7-84d8-b6ca136525f5';

  
  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const response = await axiosClient.get(`/api/users/${sellerId}`);
        console.log('hihi:', response.data);
        setSellerData(response.data);
      } catch (error) {
        console.error('Error fetching seller data:', error);
      }
    };

    fetchSellerData();
  }, [sellerId]);

  if (!sellerData) {
    return <div>Loading...</div>;
  }
  return (
    <>
    <div className="pt-16 relative">
    <div className="bg-primary pt-8 h-56 relative content overflow-hidden">
      <img className='absolute top-0 right-0 h-full object-contain' src="https://bidout-wp.b-cdn.net/wp-content/uploads/2022/10/client-right.png"></img>
      <img className='absolute left-0 h-full object-contain' src="https://bidout-wp.b-cdn.net/wp-content/uploads/2022/10/client-right.png"></img>
    </div>
    <div className="flex items-center justify-between border p-3 shadow-md rounded-t-[40px] relative -mt-10 z-10 bg-white ">
                <div className="flex items-center gap-3 w-[75%] m-auto">
                  <div className='flex items-center gap-3 w-64 h-32'>
                <ProfileCard>
                  <img src={User2} alt={User2} />
                </ProfileCard>
                  <div>
                    <Title level={5} className="text-xl">
                      ABC Store
                    </Title>   
                    <div className='flex items-center gap-1'>
                    <CiLocationOn></CiLocationOn>       
                    <Caption>Ha Noi, Vietnam</Caption>
                    </div>                    
                  </div>
                  </div>

                  <div className='flex items-center gap-8 h-32'>
                    <div className=''>
                      <div className='flex items-center gap-3'>
                      <CiShop> </CiShop>
                      <Caption>500 products</Caption>
                      </div>
                      <div className='flex items-center gap-3'>
                        <CiStar></CiStar>
                    <Caption>96,1% postive Feedback</Caption>
                    </div>
                    </div>
                    <div className='pr-8'>
                    <div className='flex items-center gap-3'>
                      <LuPackageCheck></LuPackageCheck>
                    <Caption>11k item sold</Caption>
                    </div>
                    <div className='flex items-center gap-2'>
                    <GoPeople/>
                   <Caption>336 followers</Caption>
                   </div>
                    </div>

                    <div className='w-96 flex justitfy-center ltr'>
                    <button className=" ms-8 w-24 px-2 py-1 text-sm border-2 rounded-full text-white border-green bg-green" > + Follow</button>    
                    <button className=" ms-8 w-24 px-2 py-1 text-sm border-2 rounded-full text-white border-green bg-green flex items-center gap-1"> 
                      <IoChatbubbleEllipsesOutline className='ml-3'/>Chat
                    </button>                   
                    </div>                    
                  </div>                  
                </div>
        </div>
    <section className="product-home">
        <Container>
          <Title className="pt-8" level={4}>All Auction</Title>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 my-8">
            {paginatedProducts?.map((item, index) => (
              <ProductCard item={item} key={index + 1} />
            ))}
          </div>
        </Container>
      </section>
      <Pagination
        totalItems={productlists.length}
        itemsPerPage={ITEMS_PER_PAGE}
        pagesPerGroup={PAGES_PER_GROUP}
        onPageChange={handlePageChange}
      />
      </div>
    </>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productlists } from '../../utils/data';
import { Container, Title, Caption, ProfileCard } from '../../router';
import { CiLocationOn } from 'react-icons/ci';
import User2 from '../../assets/User2.png';

export const ShopView = () => {
  const ITEMS_PER_PAGE = 12; 
  const PAGES_PER_GROUP = 3; 

  const { sellerId } = useParams();
  const [sellerData, setSellerData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sellerProducts, setSellerProducts] = useState([]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedProducts = sellerProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    // Lọc dữ liệu sản phẩm theo sellerId
    const filteredProducts = productlists.filter(product => product.sellerId === sellerId);
    setSellerProducts(filteredProducts);

    // Giả sử sellerData có thể được lấy từ sản phẩm đầu tiên
    if (filteredProducts.length > 0) {
      setSellerData({
        name: `Seller ${sellerId}`,
        location: 'Ha Noi, Vietnam',
      });
    }
  }, [sellerId]);

  if (!sellerData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="bg-primary pt-8 h-56 relative content overflow-hidden">
        <img className='absolute top-0 right-0 h-full object-contain' src="https://bidout-wp.b-cdn.net/wp-content/uploads/2022/10/client-right.png" alt="Background" />
        <img className='absolute left-0 h-full object-contain' src="https://bidout-wp.b-cdn.net/wp-content/uploads/2022/10/client-right.png" alt="Background" />
      </div>
      <div className="flex items-center justify-between border p-3 shadow-md rounded-t-[40px] relative -mt-10 z-10 bg-white ">
        <div className="flex items-center gap-3 w-[75%] m-auto">
          <div className='flex items-center gap-3 w-64 h-32'>
            <ProfileCard>
              <img src={User2} alt="User" />
            </ProfileCard>
            <div>
              <Title level={5} className="text-xl">
                {sellerData.name}
              </Title>
              <div className='flex items-center gap-1'>
                <CiLocationOn />
                <Caption>{sellerData.location}</Caption>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Container>
        <div className="grid grid-cols-3 gap-4 mt-8">
          {paginatedProducts.map(product => (
            <div key={product.id} className="border p-4 rounded-lg shadow-md">
              <img src={product.productImages} alt={product.name} className="w-full h-48 object-cover rounded-lg" />
              <Title level={4} className="mt-4">{product.name}</Title>
              <Caption>{product.description}</Caption>
              <div className="flex justify-between items-center mt-2">
                <span className="text-green-500">${product.price}</span>
                <span className="text-gray-500">{product.timeleft}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default ShopView;
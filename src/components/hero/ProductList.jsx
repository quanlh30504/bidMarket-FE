import { useEffect, useState } from "react";
import { Container, Heading } from "../../router";
import axiosClient from "../../services/axiosClient"; // Đường dẫn tới file axiosClient
import { ProductCard } from "../cards/ProductCard";

export const ProductList = () => {
  const [auctionList, setAuctionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/api/auctions/search", {
          params: {
            page: 0,
            size: 12,
            sortField: "currentPrice",
            sortDirection: "ASC",
          },
        });
        setAuctionList(response.data.content); // Gán dữ liệu sản phẩm từ API
        console.log(auctionList)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <section className="product-home">
        <Container>
          <Heading
            title="Live Auction"
            subtitle="Explore on the world's best & largest Bidding marketplace with our beautiful Bidding products. We want to be a part of your smile, success and future growth."
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 my-8">
            {auctionList?.map((item, index) => (
              <ProductCard item={item} key={index + 1} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
};

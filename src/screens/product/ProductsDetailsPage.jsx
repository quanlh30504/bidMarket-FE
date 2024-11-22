import { Body, Caption, Container, Title } from "../../router";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { commonClassNameOfInput } from "../../components/common/Design";
import { AiOutlinePlus } from "react-icons/ai";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  MdOutlineFavorite,
  MdFavoriteBorder,
  MdFavorite,
} from "react-icons/md";
import { PrimaryButton } from "../../components/common/Design";
import { FaCheckCircle } from "react-icons/fa";
import axiosClient from "../../services/axiosClient";
import ProductImages from "./ProductImages";
import { authUtils } from "../../utils/authUtils";
import { LoginRequire } from "../../components/common/LoginRequire";

export const ProductsDetailsPage = () => {
  const { id } = useParams(); // Lấy id từ URL

  const [activeTab, setActiveTab] = useState("description");
  const [auction, setAuction] = useState(null); // Trạng thái lưu thông tin sản phẩm
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistId, setWatchlistId] = useState("");
  const [isHovered, setIsHovered] = useState(false); // Trạng thái hover
  const [showLoginModal, setShowLoginModal] = useState(false); // Trạng thái modal đăng nhập

  function formatTime(dateString) {
    const date = new Date(dateString);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Lấy các thành phần của ngày giờ
    const month = months[date.getMonth()]; // Lấy tên tháng
    const day = date.getDate(); // Lấy ngày
    const year = date.getFullYear(); // Lấy năm

    // Lấy giờ và định dạng am/pm
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Lấy phút (thêm 0 nếu cần)
    const ampm = hours >= 12 ? "pm" : "am"; // Xác định am/pm
    hours = hours % 12 || 12; // Đổi giờ về dạng 12 giờ (1-12)

    return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
  }

  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/api/auctions/${id}`);
      setAuction(data);
    } catch (err) {
      setError("Failed to fetch auction details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchWatchlistStatus = useCallback(async () => {
    if (!authUtils.isAuthenticated) return;
    try {
      const { data } = await axiosClient.get(`/api/watchlist/getWatchlist`, {
        params: {
          userId: authUtils.getCurrentUserId(),
          auctionId: id,
        },
      });
      setIsInWatchlist(!!data);
      setWatchlistId(data || "");
    } catch (err) {
      console.error("Error fetching watchlist status:", err);
    }
  }, [authUtils.isAuthenticated(), id]);

  useEffect(() => {
    fetchProductDetails();
    fetchWatchlistStatus();
  }, [fetchProductDetails, fetchWatchlistStatus]);

  useEffect(() => {
    if (auction?.endTime) {
      const interval = setInterval(() => {
        const difference = new Date(auction.endTime) - new Date();
        setTimeLeft(
          difference > 0
            ? {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
                seconds: Math.floor((difference / 1000) % 60),
              }
            : null
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [auction?.endTime]);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const addToWatchlist = async () => {
    try {
      const response = await axiosClient.post(`/api/watchlist/add`, null, {
        params: {
          userId: authUtils.getCurrentUserId(),
          auctionId: auction.id,
        },
      });
      setIsInWatchlist(true);
      setWatchlistId(response.data.id);
    } catch (error) {
      console.error("Lỗi khi thêm vào Watchlist:", error);
      alert("Không thể thêm vào Watchlist. Vui lòng thử lại sau.");
    }
  };

  const removeFromWatchlist = async () => {
    try {
      await axiosClient.delete(`/api/watchlist/remove/${watchlistId}`);
      setIsInWatchlist(false);
    } catch (error) {
      console.error("Lỗi khi xóa khỏi Watchlist:", error);
      alert("Không thể xóa khỏi Watchlist. Vui lòng thử lại sau.");
    }
  };

  const handleWatchlistClick = () => {
    if (!authUtils.isAuthenticated()) {
      // Nếu chưa đăng nhập, hiển thị modal
      setShowLoginModal(true);
      return;
    }

    if (isInWatchlist) {
      removeFromWatchlist();
    } else {
      addToWatchlist();
    }
  };

  return (
    <>
      <section className="pt-24 px-8">
        <Container>
          <div className="flex justify-between gap-8">
            <div className="w-1/2">
              {auction && (
                <ProductImages images={auction.productDto.productImages} />
              )}
              <div className="flex justify-center">
                <PrimaryButton
                  onClick={handleWatchlistClick}
                  className={`${
                    isInWatchlist
                      ? "bg-green-500 hover:bg-red-500"
                      : "bg-blue-500 hover:bg-blue-600"
                  } rounded-lg px-5 py-3 mt-4 flex items-center`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {isInWatchlist ? (
                    <>
                      {isHovered ? (
                        <>
                          <MdFavoriteBorder className="mr-2" size={20} />
                          Unwatch
                        </>
                      ) : (
                        <>
                          <MdFavorite className="mr-2" size={20} />
                          Watching
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <MdOutlineFavorite className="mr-2" size={20} />
                      Add to Watchlist
                    </>
                  )}
                </PrimaryButton>
                {/* Modal đăng nhập */}
                {showLoginModal && (
                  <LoginRequire
                    onClose={() => setShowLoginModal(false)}
                    onLogin={() => (window.location.href = "/auth/login")}
                    content={"Log in to use the add to Watchlist feature."}
                  />
                )}
              </div>
            </div>
            <div className="w-1/2">
              <Title level={2} className="capitalize">
                {auction?.title}
              </Title>
              <div className="flex gap-5">
                <div className="flex text-green ">
                  <IoIosStar size={20} />
                  <IoIosStar size={20} />
                  <IoIosStar size={20} />
                  <IoIosStarHalf size={20} />
                  <IoIosStarOutline size={20} />
                </div>
                <Caption>(2 customer reviews)</Caption>
              </div>
              <br />
              <Body>
                Korem ipsum dolor amet, consectetur adipiscing elit. Maece nas
                in pulvinar neque. Nulla finibus lobortis pulvinar. Donec a
                consectetur nulla.
              </Body>
              <br />
              <Caption>Item condition: New</Caption>
              <br />
              <Caption>Item Verifed: Yes</Caption>
              <br />
              <Caption>Time left:</Caption>
              <br />
              <div className="flex gap-8 text-center">
                {timeLeft ? (
                  <>
                    <div className="p-5 px-10 shadow-s1">
                      <Title level={4}>{timeLeft.days}</Title>
                      <Caption>Days</Caption>
                    </div>
                    <div className="p-5 px-10 shadow-s1">
                      <Title level={4}>{timeLeft.hours}</Title>
                      <Caption>Hours</Caption>
                    </div>
                    <div className="p-5 px-10 shadow-s1">
                      <Title level={4}>{timeLeft.minutes}</Title>
                      <Caption>Minutes</Caption>
                    </div>
                    <div className="p-5 px-10 shadow-s1">
                      <Title level={4}>{timeLeft.seconds}</Title>
                      <Caption>Seconds</Caption>
                    </div>
                  </>
                ) : (
                  <div>Auction ended</div>
                )}
              </div>
              <br />
              <Title className="flex items-center gap-2">
                Auction ends:
                <Caption>{formatTime(auction?.endTime)}</Caption>
              </Title>
              <Title className="flex items-center gap-2 my-5">
                Timezone: <Caption>UTC 0</Caption>
              </Title>
              <Title className="flex items-center gap-2 my-5">
                Start Price:<Caption>${auction?.startingPrice} </Caption>
              </Title>
              <Title className="flex items-center gap-2">
                Current bid:
                <Caption className="text-3xl">
                  ${auction?.currentPrice}{" "}
                </Caption>
              </Title>
              <div className="p-5 px-10 shadow-s3 py-8">
                <form className="flex gap-3 justify-between">
                  <input
                    className={commonClassNameOfInput}
                    type="number"
                    name="price"
                  />
                  <button
                    type="button"
                    className="bg-gray-100 rounded-md px-5 py-3"
                  >
                    <AiOutlinePlus />
                  </button>
                  <button
                    type="submit"
                    className={`py-3 px-8 rounded-lg ${"bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="details mt-8">
            <div className="flex items-center gap-5">
              <button
                className={`rounded-md px-10 py-4 text-black shadow-s3 ${
                  activeTab === "description"
                    ? "bg-green text-white"
                    : "bg-white"
                }`}
                onClick={() => handleTabClick("description")}
              >
                Description
              </button>
              <button
                className={`rounded-md px-10 py-4 text-black shadow-s3 ${
                  activeTab === "auctionHistory"
                    ? "bg-green text-white"
                    : "bg-white"
                }`}
                onClick={() => handleTabClick("auctionHistory")}
              >
                Auction History
              </button>
              <button
                className={`rounded-md px-10 py-4 text-black shadow-s3 ${
                  activeTab === "reviews" ? "bg-green text-white" : "bg-white"
                }`}
                onClick={() => handleTabClick("reviews")}
              >
                Reviews(2)
              </button>
              <button
                className={`rounded-md px-10 py-4 text-black shadow-s3 ${
                  activeTab === "moreProducts"
                    ? "bg-green text-white"
                    : "bg-white"
                }`}
                onClick={() => handleTabClick("moreProducts")}
              >
                More Products
              </button>
            </div>

            <div className="tab-content mt-8">
              {activeTab === "description" && (
                <div className="description-tab shadow-s3 p-8 rounded-md">
                  <Title level={4}>Description</Title>
                  <br />
                  <Caption className="leading-7">
                    If you’ve been following the crypto space, you’ve likely
                    heard of Non-Fungible Tokens (Biddings), more popularly
                    referred to as ‘Crypto Collectibles.’ The world of Biddings
                    is growing rapidly. It seems there is no slowing down of
                    these assets as they continue to go up in price. This growth
                    comes with the opportunity for people to start new
                    businesses to create and capture value. The market is open
                    for players in every kind of field. Are you a collector.
                  </Caption>
                  <Caption className="leading-7">
                    If you’ve been following the crypto space, you’ve likely
                    heard of Non-Fungible Tokens (Biddings), more popularly
                    referred to as ‘Crypto Collectibles.’ The world of Biddings
                    is growing rapidly. It seems there is no slowing down of
                    these assets as they continue to go up in price. This growth
                    comes with the opportunity for people to start new
                    businesses to create and capture value. The market is open
                    for players in every kind of field. Are you a collector.
                  </Caption>
                  <br />
                  <Title level={4}>Product Overview</Title>
                  <div className="flex justify-between gap-5">
                    <div className="mt-4 capitalize w-1/2">
                      <div className="flex justify-between border-b py-3">
                        <Title>category</Title>
                        <Caption>Category</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>height</Title>
                        <Caption> 200 (cm)</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>length</Title>
                        <Caption> 300 (cm)</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>width</Title>
                        <Caption> 400 (cm)</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>weigth</Title>
                        <Caption> 50 (kg)</Caption>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <Title>medium used</Title>
                        <Caption> Gold </Caption>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <Title>Price</Title>
                        <Caption> $50000 </Caption>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <Title>Sold out</Title>
                        Yes
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <Title>verify</Title>
                        No
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <Title>Create At</Title>
                        <Caption>December 31, 2024 12:00 am</Caption>
                      </div>
                      <div className="flex justify-between py-3">
                        <Title>Update At</Title>
                        <Caption>December 31, 2024 12:00 am</Caption>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="h-[60vh] p-2 bg-green rounded-xl">
                        <img
                          src="https://bidout-wp.b-cdn.net/wp-content/uploads/2022/10/Image-14.jpg"
                          alt=""
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "auctionHistory" && <AuctionHistory />}
              {activeTab === "reviews" && (
                <div className="reviews-tab shadow-s3 p-8 rounded-md">
                  <Title level={5} className=" font-normal">
                    Reviews
                  </Title>
                  <hr className="my-5" />
                  <Title level={5} className=" font-normal text-red-500">
                    Cooming Soon!
                  </Title>
                </div>
              )}
              {activeTab === "moreProducts" && (
                <div className="more-products-tab shadow-s3 p-8 rounded-md">
                  <h1>More Products</h1>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};
const CountdownTimer = ({ timeLeft }) => (
  <div className="flex gap-8 text-center">
    {timeLeft ? (
      ["days", "hours", "minutes", "seconds"].map((unit) => (
        <div key={unit} className="p-5 px-10 shadow-s1">
          <Title level={4}>{timeLeft[unit]}</Title>
          <Caption>{unit.charAt(0).toUpperCase() + unit.slice(1)}</Caption>
        </div>
      ))
    ) : (
      <div>Auction ended</div>
    )}
  </div>
);

export const AuctionHistory = () => {
  return (
    <>
      <div className="shadow-s1 p-8 rounded-lg">
        <Title level={5} className=" font-normal">
          Auction History
        </Title>
        <Caption className="flex item-centers mt-4">
          <FaCheckCircle className="font-medium text-green mr-2" size={25} />
          toasthall, you are the winner!
        </Caption>
        <hr className="my-5" />

        <div className="relative overflow-x-auto rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-5">
                  Bidder
                </th>
                <th scope="col" className="px-6 py-3">
                  Bid Amount
                </th>
                <th scope="col" className="px-6 py-3">
                  Bid Time
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-blue-500">toasthall</td>
                <td className="px-6 py-4">$200</td>
                <td className="px-6 py-4">18-May-16 20:57:23</td>
                <td className="px-6 py-4"></td>
              </tr>
              <tr className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">Starting Price</td>
                <td className="px-6 py-4">$2</td>
                <td className="px-6 py-4">12-May-16 20:57:23</td>
                <td className="px-6 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="shadow-s1 p-8 rounded-lg mt-5">
        <Title level={5} className=" font-normal">
          Bid retraction and cancellation history
        </Title>
        <div className="relative overflow-x-auto rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-5">
                  Bidder
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
                <th scope="col" className="px-6 py-3">
                  Date of Bid and Retraction
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-blue-500">toasthall</td>
                <td className="px-6 py-4 text-red-500"> Retracted: $200</td>
                <td className="px-6 py-4">
                  <span className="font-bold">Bid:</span> 18-May-16 20:57:23
                  <br />
                  <span className="font-bold">Retracted:</span> 18-May-16
                  20:57:23
                </td>
                <td className="px-6 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};



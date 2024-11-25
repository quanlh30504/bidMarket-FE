import { Body, Caption, Container, Title } from "../../router";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { commonClassNameOfInput } from "../../components/common/Design";
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
import { Pagination } from "../../components/pagination";

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
  const [bidAmount, setBidAmount] = useState(""); // Track the bid amount
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);

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

  const placeBid = async () => {
    if (!authUtils.isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }

    if (bidAmount - auction?.currentPrice < auction?.minimumBidIncrement) {
      alert(
        "Your bid must be higher than the current bid at least $" +
          auction?.minimumBidIncrement
      );
      return;
    }

    try {
      setIsSubmittingBid(true);
      const userId = authUtils.getCurrentUserId();
      await axiosClient.post("/api/bids", {
        userId,
        auctionId: auction.id,
        bidAmount,
      });
      alert("Bid placed successfully!");
      fetchProductDetails();
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Failed to place the bid. Please try again.");
    } finally {
      setIsSubmittingBid(false);
    }
  };

  const renderContentByStatus = () => {
    switch (auction?.status) {
      case "OPEN":
        return (
          <>
            <Caption>Time left:</Caption>
            <br />
            <div className="flex gap-8 text-center">
              {timeLeft ? (
                <>
                  {["Days", "Hours", "Minutes", "Seconds"].map((unit, i) => (
                    <div key={unit} className="p-5 px-10 shadow-s1">
                      <Title level={4}>
                        {timeLeft[Object.keys(timeLeft)[i]]}
                      </Title>
                      <Caption>{unit}</Caption>
                    </div>
                  ))}
                </>
              ) : (
                <div>Auction ended</div>
              )}
            </div>
            <div className="mt-6 flex items-center gap-4">
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter your bid"
                className={`${commonClassNameOfInput} w-1/3`} // Ensuring input has width
              />
              <PrimaryButton
                onClick={placeBid}
                disabled={isSubmittingBid}
                className={`${
                  isSubmittingBid ||
                  bidAmount - auction?.currentPrice <
                    auction?.minimumBidIncrement
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-lg w-1/3`}
              >
                {isSubmittingBid ? "Placing..." : "Place"}
              </PrimaryButton>
            </div>
            <br></br>
          </>
        );

      case "READY":
      case "PENDING":
        return (
          <>
            <Caption>
            The auction will open at: {formatTime(auction.startTime)}
            </Caption>
            <br></br>
            <div className="flex gap-8 text-center">
              {timeLeft ? (
                <>
                  {["Days", "Hours", "Minutes", "Seconds"].map((unit, i) => (
                    <div key={unit} className="p-5 px-10 shadow-s1">
                      <Title level={4}>
                        {timeLeft[Object.keys(timeLeft)[i]]}
                      </Title>
                      <Caption>{unit}</Caption>
                    </div>
                  ))}
                </>
              ) : (
                <div>Countdown complete</div>
              )}
            </div>
            <br></br>
          </>
        );

      case "CLOSED":
      case "COMPLETED":
        return (
          <>
            {auction.bidCount > 0 ? (
              <Caption>
                Người chiến thắng: {auction.winnerName || "Không xác định"}
              </Caption>
            ) : (
              <Caption>Phiên đấu giá không có người chiến thắng</Caption>
            )}
          </>
        );

      case "CANCELLED":
        return <Caption>Phiên đấu giá đã bị hủy</Caption>;

      default:
        return <Caption>Trạng thái không xác định</Caption>;
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
                    content={"Log in to use the feature"}
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
              {/* <div className="flex gap-8 text-center">
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
              <br /> */}
              {renderContentByStatus()}
              <Title className="flex items-center gap-2">
                Auction ends:
                <Caption>{formatTime(auction?.endTime)}</Caption>
              </Title>
              <Title className="flex items-center gap-2 my-5">
                Minimum bid increment:
                <Caption className="text-3xl">
                  US ${auction?.minimumBidIncrement}{" "}
                </Caption>
              </Title>
              <Title className="flex items-center gap-2 my-5">
                Start Price:<Caption>US ${auction?.startingPrice} </Caption>
              </Title>
              <Title className="flex items-center gap-2">
                Current bid:
                <Caption className="text-3xl">
                  US ${auction?.currentPrice}{" "}
                </Caption>
              </Title>
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
              {activeTab === "auctionHistory" && (
                <AuctionHistory
                  auctionId={auction.id}
                  startingPrice={auction.startingPrice}
                  currentUserId={authUtils.getCurrentUserId()}
                  winnerName={""}
                />
              )}
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
export const AuctionHistory = ({
  auctionId,
  startingPrice,
  currentUserId,
  winnerName,
}) => {
  const [bids, setBids] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10; // Số lượng item mỗi trang
  const pagesPerGroup = 5; // Số lượng trang mỗi nhóm

  const fetchBids = async (page) => {
    try {
      const response = await axiosClient.get(`/api/bids/auction/${auctionId}`, {
        params: {
          page: page - 1, // API nhận page từ 0
          size: itemsPerPage,
          status: "VALID",
          sortField: "bidTime",
          direction: "DESC",
        },
      });
      const data = response.data;
      setBids(data.content);
      setTotalItems(data.totalElements);
    } catch (error) {
      console.error("Error fetching auction bids:", error);
    }
  };

  useEffect(() => {
    fetchBids(1); // Gọi dữ liệu trang đầu tiên
  }, []);

  return (
    <div className="shadow-s1 p-8 rounded-lg bg-white">
      <h5 className="text-lg font-normal">Auction History</h5>
      {winnerName && (
        <div className="flex items-center mt-4 text-green-600">
          <FaCheckCircle className="mr-2" size={25} />
          <span className="text-sm">
            Congratulations {winnerName}, you are the winner!
          </span>
        </div>
      )}
      <hr className="my-5" />

      <div className="relative overflow-x-auto rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
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
            </tr>
          </thead>
          <tbody>
            {bids.map((bid, index) => (
              <tr
                key={index}
                className={`bg-white border-b hover:bg-gray-50 ${
                  bid.userId === currentUserId
                    ? "text-blue-500 font-medium"
                    : ""
                }`}
              >
                <td className="px-6 py-4">
                  {bid.userId === currentUserId ? "You" : bid?.userId}
                </td>
                <td className="px-6 py-4">
                  US ${bid.bidAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {new Date(bid.bidTime).toLocaleString()}
                </td>
              </tr>
            ))}
            <tr>
              <td className="px-6 py-4">Startting price</td>
              <td className="px-6 py-4">US ${startingPrice}</td>
              <td className="px-6 py-4"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        pagesPerGroup={pagesPerGroup}
        onPageChange={fetchBids}
        className="mt-4"
        buttonClassName="bg-blue-500 text-white hover:bg-blue-700"
      />
    </div>
  );
};

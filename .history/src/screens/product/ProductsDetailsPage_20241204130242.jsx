import { Body, Caption, Container, Title, ProfileCard } from "../../router";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdOutlineFavorite,
  MdFavoriteBorder,
  MdFavorite,
} from "react-icons/md";
import { PrimaryButton } from "../../components/common/Design";
import axiosClient from "../../services/axiosClient";
import ProductImages from "./ProductImages";
import { authUtils } from "../../utils/authUtils";
import { LoginRequire } from "../../components/common/LoginRequire";
import { User2 } from "../../components/hero/Hero";
import { useNotification } from "../../notifications/NotificationContext";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import { RelatedAuctions } from "./RelatedAuctions";
import { Comments } from "./Comments";
import { formatTime } from "../../utils/DateFormatter";
import { AuctionHistory } from "./AuctionHistory";
import WebSocketService from "../../services/WebSocketService";


export const ProductsDetailsPage = () => {
  const { id } = useParams();

  const userId = authUtils.getCurrentUserId();
  const isAuth = authUtils.isAuthenticated()

  const [activeTab, setActiveTab] = useState("description");
  const [auction, setAuction] = useState(null);
  const [relatedAuctions, setRelatedAuctions] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistId, setWatchlistId] = useState("");
  const [isHovered, setIsHovered] = useState(false); // Trạng thái hover
  const [showLoginModal, setShowLoginModal] = useState(false); // Trạng thái modal đăng nhập
  const [bidAmount, setBidAmount] = useState(""); // Track the bid amount
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(null);
<<<<<<< HEAD
  const [sellerId, setSellerId] = useState(null);

  const navigate = useNavigate();
  const [sellerData, setSellerData] = useState(null);
=======
  const [bids, setBids] = useState([])
  const [comments, setComments] = useState([])
>>>>>>> quan_dev_api

  const defaultImageUrl = "https://via.placeholder.com/400x400?text=No+Image";

  // Xử lý mảng images hoặc fallback về ảnh mặc định
  const images = auction?.productDto?.productImages;
  const validImages = images && images.length > 0 ? images : [{ imageUrl: defaultImageUrl }];

  const selectedImage = validImages.find((image) => image.isPrimary)?.imageUrl || validImages[0].imageUrl;

  const { showToastNotification } = useNotification();

  const webSocketService = new WebSocketService();

  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/api/auctions/${id}`);
      setAuction(data);
      setCurrentPrice(data.currentPrice);
      setSellerId(data.productDto.sellerId);
    } catch (err) {
      setError("Failed to fetch auction details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchWatchlistStatus = useCallback(async () => {
    if (!isAuth) return;
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
  }, [isAuth, id]);

<<<<<<< HEAD
  const fetchSellerData = async () => {
    try {
      const sellerResponse = await axiosClient.get(`/api/users/${sellerId}/accountInfo`);
      setSellerData(sellerResponse.data);
    } catch (error) {
      console.error('Error fetching seller data:', error);
    }
  };

=======
  const fetchRelatedAuction = useCallback(async () => {
    try {
      console.log("Start load related auction")
      setLoading(true);
      const { data } = await axiosClient.get(`/api/auctions/search`, {
        params: {
          // categoryType: auction.productDto.categories.join(","),
          hasNotId: auction?.id,
          status: "OPEN",
          page: 0,
          size: 15
        }
      });
      setRelatedAuctions(data.content);
      console.log(relatedAuctions)
    } catch (err) {
      setError("Failed to fetch related auctions.");
    } finally {
      setLoading(false);
    }
  }, [id]);
>>>>>>> quan_dev_api

  useEffect(() => {
    fetchProductDetails();
    fetchWatchlistStatus();
    fetchRelatedAuction();

    webSocketService.connect(
      () => {
        console.log('Connected to WebSocket');
        // Subscribe to the first topic
        const commentSubscription = webSocketService.subscribe(
          `/topic/auction-comments/${id}`,
          handleCommentWebSocketEvent
        );

        // Subscribe to the second topic
        const bidSubscription = webSocketService.subscribe(
          `/topic/auction-bids/auctionId/${id}`,
          handleBidWebSocketEvent // Bạn cần thêm logic xử lý khác nếu cần
        );

        return () => {
          webSocketService.unsubscribe(commentSubscription);
          webSocketService.unsubscribe(bidSubscription);
          webSocketService.disconnect();
        };
      },
      (error) => console.error('WebSocket connection error:', error)
    );

  }, [fetchProductDetails, fetchWatchlistStatus, fetchRelatedAuction]);

  const handleBidWebSocketEvent = async (event) => {
    console.log("event bid: " + JSON.stringify(event))
    switch (event.action) {
      case "create":
        if (event.data.status === "VALID") {
          setBids((prev) => [event.data, ...prev]);
          await showToastNotification(`Your bid is successful`);
          setCurrentPrice(event.data.bidAmount);
          setBidAmount("");
        } else if (event.data.status === "INVALID") {
          showToastNotification("The bid is invalid or has been canceled.", "error");
        } else {
          console.warn("Unhandled event status:", event.status);
        }
        break;

      default:
        console.warn("Unknown event action:", event.action);
        break;
    }
  };

  const handleCommentWebSocketEvent = async (event) => {
    switch (event.action) {
      case 'create':
        console.log("create event" + JSON.stringify(event.data))
        setComments((prev) => [event.data, ...prev]);
        console.log(comments)
        break;
      case 'update':
        setComments((prev) =>
          prev.map((c) => (c.id === event.data.id ? event.data : c))
        );
        break;
      case 'delete':
        setComments((prev) => prev.filter((c) => c.id !== event.data.id));
        break;
      default:
        console.warn('Unknown event type:', event.type);
    }
  };

  useEffect(() => {

    fetchSellerData();
  }, [sellerId]);

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
  
  const handleViewShopClick = () => {
    navigate(`/shop/${sellerId}`);
  }
  
  const handleChatClick = async () => {
    try {
      const response = await axiosClient.post('/api/chat/get-or-create-room', null, {
        params: { otherUserId: sellerId }
      });
      const roomId = response.data.id;
      navigate(`/chat?roomId=${roomId}`);
    } catch (error) {
      console.error('Error creating or getting chat room:', error);
    }
  };

  const placeBid = async () => {
    if (!isAuth) {
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


    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Failed to place the bid. Please try again.");
    } finally {
      setIsSubmittingBid(false);
    }
  };

  const renderContentByStatus = () => {
    const statusStyles = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
      READY: "bg-blue-100 text-blue-800 border-blue-300",
      OPEN: "",
      CLOSED: "bg-gray-100 text-gray-800 border-gray-300",
      COMPLETED: "bg-purple-100 text-purple-800 border-purple-300",
      CANCELLED: "bg-red-100 text-red-800 border-red-300",
    };

    const renderCountdown = () => (
      <div className="flex justify-center gap-6 text-center">
        {timeLeft ? (
          ["Days", "Hours", "Minutes", "Seconds"].map((unit, i) => (
            <div
              key={unit}
              className="p-4 px-8 shadow-md border rounded-md bg-white"
            >
              <Title level={4} className="font-bold text-gray-700">
                {timeLeft[Object.keys(timeLeft)[i]]}
              </Title>
              <Caption className="text-sm text-gray-500">{unit}</Caption>
            </div>
          ))
        ) : (
          <div className="text-gray-600">Countdown complete</div>
        )}
      </div>
    );

    switch (auction?.status) {
      case "OPEN":
        return (
          <div
            className={`${statusStyles.OPEN} p-6 rounded-md border flex flex-col items-center text-center`}
          >
            <Caption className="font-semibold text-lg">
              Time left to bid:
            </Caption>
            <div className="mt-4">{renderCountdown()}</div>
            <div className="mt-8 flex items-center gap-4 w-full max-w-lg justify-center">
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter your bid"
                className="border border-gray-300 rounded-lg p-2 w-1/2 focus:outline-blue-500"
              />
              <PrimaryButton
                onClick={placeBid}
                disabled={isSubmittingBid}
                className={`${isSubmittingBid ||
                  bidAmount - auction?.currentPrice <
                  auction?.minimumBidIncrement
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                  } text-white rounded-lg w-1/3`}
              >
                {isSubmittingBid ? "Placing..." : "Place"}
              </PrimaryButton>
            </div>
          </div>
        );

      case "READY":
      case "PENDING":
        return (
          <div
            className={`${statusStyles[auction.status]} p-6 rounded-md border flex flex-col items-center text-center`}
          >
            <Caption className="font-semibold text-lg">
              {auction.status === "READY"
                ? "Get ready! The auction is starting soon!"
                : "The auction is pending and will start soon!"}
            </Caption>
            <Caption className="mt-2 text-gray-600">
              Start time: {formatTime(auction.startTime)}
            </Caption>
            <div className="mt-6">{renderCountdown()}</div>
          </div>
        );

      case "CLOSED":
      case "COMPLETED":
        return (
          <div
            className={`${statusStyles[auction.status]} p-6 rounded-md border flex flex-col items-center text-center`}
          >
            {auction.bidCount > 0 ? (
              <Caption className="font-semibold text-lg">
                Winner: <span className="text-blue-700">{auction.winnerName || "Unknown"}</span>
              </Caption>
            ) : (
              <Caption className="font-semibold text-lg">
                No winner for this auction.
              </Caption>
            )}
          </div>
        );

      case "CANCELED":
        return (
          <div
            className={`${statusStyles.CANCELLED} p-6 rounded-md border flex flex-col items-center text-center`}
          >
            <Caption className="font-semibold text-lg">
              The auction has been canceled.
            </Caption>
          </div>
        );

      default:
        return (
          <div className="bg-gray-100 text-gray-800 p-6 rounded-md border flex flex-col items-center text-center">
            <Caption className="font-semibold text-lg">
              Unknown auction status.
            </Caption>
          </div>
        );
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
                  className={`${isInWatchlist
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
              <div className="flex items-center justify-center border p-3 rounded-lg shadow-md mt-8 ml-5 w-11/12 h-32">
                <div className="flex items-center gap-3">
                  <ProfileCard className="w-16 h-16">
                    <img src={User2} alt="User2" />
                  </ProfileCard>
                  <div>
                    <Title level={5} className="text-xl">{sellerData?.fullName || "Unknown Store"}</Title>
                    <div className="flex items-center gap-1 mt-3">
                      <CiLocationOn />
                      <Caption>{`${sellerData?.streetAddress || ""}, ${sellerData?.city || ""}, ${
                    sellerData?.country || ""
                  }`}{" "}</Caption>
                    </div>
                  </div>
                  <div className="flex justify-center ltr mt-8 -my-5">
                    <button className="w-24 px-2 py-1 text-sm border-2 rounded-full text-white border-green bg-green" onClick={handleViewShopClick}>View Shop</button>
                    <button className="ms-8 w-24 px-2 py-1 text-sm border-2 rounded-full text-white border-green bg-green flex items-center gap-1" onClick={handleChatClick}>
                      <IoChatbubbleEllipsesOutline className="ml-3" />Chat
                    </button>
                  </div>
                </div>
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
              {renderContentByStatus()}
              <br />
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
                  US ${currentPrice}{" "}
                </Caption>
              </Title>
            </div>
          </div>
          {/* Danh sách sản phẩm liên quan */}
          <RelatedAuctions relatedAuctions={relatedAuctions} />

          <div className="details mt-8">
            <div className="flex items-center gap-5">
              <button
                className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === "description"
                  ? "bg-green text-white"
                  : "bg-white"
                  }`}
                onClick={() => handleTabClick("description")}
              >
                Description
              </button>
              <button
                className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === "auctionHistory"
                  ? "bg-green text-white"
                  : "bg-white"
                  }`}
                onClick={() => handleTabClick("auctionHistory")}
              >
                Auction History
              </button>
              <button
                className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === "comments" ? "bg-green text-white" : "bg-white"
                  }`}
                onClick={() => handleTabClick("comments")}
              >
                Comments
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
                          src={selectedImage}
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
                  winnerName={auction.winner}
                  bids={bids}
                  setBids={setBids}
                />
              )}
              {activeTab === "comments" && <Comments auctionId={id} userId={userId} setShowLoginModal={setShowLoginModal} comments={comments} setComments={setComments}/>}

            </div>
          </div>
        </Container>
      </section>
    </>
  );
};


// const StarRating = ({ maxStars = 5, onRate }) => {
//   const [rating, setRating] = useState(0);

//   const handleStarClick = (index) => {
//     setRating(index + 1);
//     if (onRate) onRate(index + 1);
//   };

//   return (
//     <div className="flex items-center justify-center mb-5">
//       {Array.from({ length: maxStars }, (_, index) => (
//         <FaStar
//           key={index}
//           className={`cursor-pointer ${index < rating ? "text-yellow-300" : "text-gray-300"
//             }`}
//           size={25}
//           onClick={() => handleStarClick(index)}
//         />
//       ))}
//     </div>
//   );
// };

// export const Comments = (() => {

//   return (
//     <div className="reviews-tab shadow-s3 p-8 rounded-md">
//       <div className="flex items-center gap-5">
//         <Title level={4} className="">
//           Comments
//         </Title>
//         {/* <button className="w-24 px-2 py-1 text-sm border-2 rounded-full text-white border-green bg-green" onClick={handleRateClick}>Rate</button> */}
//       </div>
//       <hr className="my-5" />
//       <div className="shadow-s3 border p-8 mb-5 gap-5 flex-col rounded-xl">
//           <div>
//             <Title level={6} className="font-semibold text-left mb-5">Your comment</Title>
//             <textarea name="description" className={`${commonClassNameOfInput}`} cols="30" rows="5"></textarea>
//             <PrimaryButton type="submit" className="rounded-none my-5 flex items-center justify-center">
//               SEND
//             </PrimaryButton>
//           </div>
//         </div>
//       <div className="shadow-s3 border p-8 mb-5 gap-5 flex-col rounded-xl">
//         <div className="flex items-center">
//           <ProfileCard>
//             <img src={User2} alt={User2} />
//           </ProfileCard>
//           <Title level={6} className=" font-normal p-3"> Nguyen Van A </Title>
//         </div>
//         <div className="flex item-center gap-4 ml-12 ps-3">
//           <div className="flex item-center">
//             <FaStar className="text-yellow-300"></FaStar>
//             <FaStar className="text-yellow-300"></FaStar>
//             <FaStar className="text-yellow-300"></FaStar>
//             <FaStar className="text-yellow-300"></FaStar>
//             <FaStar className="text-gray-300"></FaStar>
//           </div>
//           <div className="text-gray-500">2024-11-19 12:30:28</div>
//         </div>
//         <Caption className="leading-7">
//           If you’ve been following the crypto space, you’ve likely heard of Non-Fungible Tokens (Biddings), more popularly referred to as ‘Crypto Collectibles.’ The world of Biddings is
//           growing rapidly. It seems there is no slowing down of these assets as they continue to go up in price. This growth comes with the opportunity for people to start new businesses to
//           create and capture value. The market is open for players in every kind of field. Are you a collector.
//         </Caption>
//       </div>
//       <div className="shadow-s3 border p-8 mb-5 gap-5 flex-col rounded-xl">
//         <div className="flex">
//           <ProfileCard>
//             <img src={User2} alt={User2} />
//           </ProfileCard>
//           <Title level={6} className=" font-normal p-3"> Nguyen Van A </Title>
//         </div>
//         <div className="flex items-center gap-4 ml-12 ps-3">
//           <div className="flex items-center">
//             <FaStar className="text-yellow-300"></FaStar>
//             <FaStar className="text-yellow-300"></FaStar>
//             <FaStar className="text-yellow-300"></FaStar>
//             <FaStar className="text-yellow-300"></FaStar>
//             <FaStar className="text-gray-300"></FaStar>
//           </div>
//           <div className="text-gray-500">2024-11-19 12:30:28</div>
//         </div>
//         <Caption className="leading-7">
//           If you’ve been following the crypto space, you’ve likely heard of Non-Fungible Tokens (Biddings), more popularly referred to as ‘Crypto Collectibles.’ The world of Biddings is
//           growing rapidly. It seems there is no slowing down of these assets as they continue to go up in price. This growth comes with the opportunity for people to start new businesses to
//           create and capture value. The market is open for players in every kind of field. Are you a collector.
//         </Caption>
//       </div>
//     </div>
//   )
// })

<<<<<<< HEAD
export const Comments = ({ auctionId, userId, setShowLoginModal }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showOptions, setShowOptions] = useState(null);
  const websocketUrl = 'http://localhost:8080/ws'; // WebSocket URL from environment variables
  const webSocketService = new WebSocketService(websocketUrl);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10; // Số lượng item mỗi trang
  const pagesPerGroup = 5; // Số lượng trang mỗi nhóm


  const getAllComments = async (page) => {
    axiosClient
      .get(`/api/comments/auction/${auctionId}`, {
        params: {
          page: page - 1, // API nhận page từ 0
          size: itemsPerPage,
          sortField: "createdAt",
          direction: "DESC",
        },
      })
      .then((response) => {
        setComments(response.data.content);
        setTotalItems(response.data.totalElements)
      })
      .catch((err) => console.error('Error fetching comments:', err));
  }

  useEffect(() => {

    getAllComments(1);

    webSocketService.connect(
      () => {
        const subscription = webSocketService.subscribe(
          `/topic/auction-comments/${auctionId}`,
          handleWebSocketEvent
        );

        return () => {
          webSocketService.unsubscribe(subscription);
          webSocketService.disconnect();
        };
      },
      (error) => console.error('WebSocket connection error:', error)
    );
  }, [auctionId]);

  const handleWebSocketEvent = (event) => {
    switch (event.action) {
      case 'create':
        setComments((prev) => [event.data, ...prev]);
        break;
      case 'update':
        setComments((prev) =>
          prev.map((c) => (c.id === event.data.id ? event.data : c))
        );
        break;
      case 'delete':
        setComments((prev) => prev.filter((c) => c.id !== event.data.id));
        break;
      default:
        console.warn('Unknown event type:', event.type);
    }
  };

  const handleNewComment = () => {
    if (!authUtils.isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }
    if (!newComment.trim()) return;

    axiosClient
      .post('/api/comments', { userId: userId, auctionId: auctionId, content: newComment })
      .then(() => {
        setNewComment('');
      })
      .catch((err) => console.error('Error posting comment:', err));
  };

  const handleDeleteComment = (commentId) => {
    axiosClient
      .delete(`/api/comments/${commentId}`)
      .then(() => {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      })
      .catch((err) => console.error('Error deleting comment:', err));
  };

  const handleEdit = (commentId, currentContent) => {
    setShowOptions(false)
    setEditingCommentId(commentId);
    setEditedContent(currentContent); // Điền nội dung hiện tại vào textarea
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent('');
  };

  const handleSaveEdit = (commentId) => {
    if (!editedContent.trim()) return;

    axiosClient
      .put(`/api/comments/${commentId}`, { content: editedContent })
      .then(() => {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId ? { ...c, content: editedContent } : c
          )
        );
        setEditingCommentId(null); // Kết thúc chỉnh sửa
        setEditedContent('');
      })
      .catch((err) => console.error('Error updating comment:', err));
  };

  const handleToggleOptions = (commentId) => {
    setShowOptions(showOptions === commentId ? null : commentId); // Toggle visibility
  };

  return (
    <div className="reviews-tab shadow-s3 p-8 rounded-md">
      <div className="flex items-center gap-5">
        <Title level={4}>Comments ({totalItems})</Title>
      </div>
      <hr className="my-5" />
      <div className="shadow-s3 border p-8 mb-5 gap-5 flex-col rounded-xl">
        <div>
          <Title level={6} className="font-semibold text-left mb-5">Your comment</Title>
          <textarea name="description" className={`${commonClassNameOfInput}`} cols="30" rows="5" value={newComment}
            onChange={(e) => setNewComment(e.target.value)}></textarea>
          <PrimaryButton
            type="button"
            className="rounded-none my-5 flex items-center justify-center"
            onClick={handleNewComment}
          >
            SEND
          </PrimaryButton>
        </div>
      </div>

      {comments.map((comment) => (
        <div
          key={comment.id}
          className="shadow-s3 border p-8 mb-5 gap-5 flex-col rounded-xl"
        >
          <div className="flex items-center">
            <ProfileCard>
              <img src={User2} alt={User2} />
            </ProfileCard>
            <Title level={6} className="font-normal p-3">{comment.userEmail}</Title>

            {comment.userId === userId && (
              <div className="relative ml-auto">
                <button
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => handleToggleOptions(comment.id)} // Toggle options when clicked
                >
                  <FaEllipsisH />
                </button>

                {showOptions === comment.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md">
                    <button
                      onClick={() => handleEdit(comment.id, comment.content)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 ml-12 ps-3">
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  className={i < comment.rating ? 'text-yellow-300' : 'text-gray-300'}
                />
              ))}
            </div>
            <div className="text-gray-500">{comment.updatedAt && comment.createdAt !== comment.updatedAt ? `Updated at: ${formatTime(comment.updatedAt)}` : formatTime(comment.createdAt)}</div>
          </div>
          <div className="ml-12 ps-3">
            {editingCommentId === comment.id ? (
              // Hiển thị textarea khi chỉnh sửa
              <div className="flex flex-col gap-2">
                <textarea
                  className="w-full p-2 border rounded"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                ></textarea>
                <div className="flex gap-2">
                  <button
                    className="bg-green text-white px-4 py-2 rounded"
                    onClick={() => handleSaveEdit(comment.id)}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (<Caption className="leading-7">{comment.content}</Caption>)}

          </div>

        </div>
      ))}
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        pagesPerGroup={pagesPerGroup}
        onPageChange={getAllComments}
        className="mt-4"
        buttonClassName="bg-blue-500 text-white hover:bg-blue-700"
      />
    </div>
  );
};
=======
>>>>>>> quan_dev_api

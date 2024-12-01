import PropTypes from "prop-types";
import { RiAuctionFill } from "react-icons/ri";
import { CiTimer } from "react-icons/ci";
import { MdOutlineFavorite } from "react-icons/md";
import { Caption, PrimaryButton, ProfileCard, Title } from "../common/Design";
import { NavLink } from "react-router-dom";

export const ProductCard = ({ item }) => {
  const product = item.productDto;
  const primaryImage =
    product?.productImages?.find((img) => img.isPrimary)?.imageUrl ||
    product?.productImages?.[0]?.imageUrl;

  // Tính toán thời gian còn lại
  const now = new Date();
  const endTime = new Date(item.endTime);
  const timeLeft = Math.max(0, endTime - now); // Thời gian còn lại (ms)

  // Nếu thời gian đã hết, tất cả giá trị đặt về 0
  const isTimeOver = timeLeft <= 0;
  const days = isTimeOver ? 0 : Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = isTimeOver ? 0 : Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = isTimeOver ? 0 : Math.floor((timeLeft / (1000 * 60)) % 60);

  return (
    <div className="bg-white shadow-s1 rounded-xl p-3">
      <div className="h-56 relative overflow-hidden">
        <NavLink to={`/details/${item.id}`}>
          <img
            src={primaryImage}
            alt={product?.name}
            className="w-full h-full object-cover rounded-xl hover:scale-105 hover:cursor-pointer transition-transform duration-300 ease-in-out"
          />
        </NavLink>
        <ProfileCard className="shadow-s1 absolute right-3 bottom-3">
          <RiAuctionFill size={22} className="text-green" />
        </ProfileCard>

        <div className="absolute top-0 left-0 p-2 w-full">
          <div className="flex items-center justify-between">
            <Caption
              className={`px-3 py-1 text-sm rounded-full ${{
                  PENDING: "text-gray-700 bg-yellow-400",
                  READY: "text-blue-700 bg-blue-200",
                  OPEN: "text-white bg-green",
                  CLOSED: "text-gray-700 bg-gray-200",
                  CANCELED: "text-red-700 bg-red-200",
                  COMPLETED: "text-blue-500 bg-slate-200",
                  EXTENDED: "text-orange-700 bg-orange-200",
                }[item.status] || "text-black bg-white" // Mặc định nếu status không khớp
                }`}
            >
              {item.status}
            </Caption>
            <Caption className="text-green bg-green_100 px-3 py-1 text-sm rounded-full">
              {item.bidCount} Bids
            </Caption>
          </div>
        </div>
      </div>
      <div className="details mt-4">
        <Title className="uppercase">{item.title}</Title>
        <hr className="mt-3" />
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center justify-between gap-5">
            <div>
              <RiAuctionFill size={40} className="text-green" />
            </div>
            <div>
              <Caption className="text-green">Current Bid</Caption>
              <Title>${item.currentPrice?.toFixed(2)}</Title>
            </div>
          </div>
          <div className="w-[1px] h-10 bg-gray-300"> </div>
          <div className="flex items-center justify-between gap-5">
            <div>
              <CiTimer size={25} className="text-red-500" />
            </div>
            <div>
              <Caption className="text-green">Time left</Caption>
              <Title>
                {days}d : {hours}h : {minutes}m
              </Title>
            </div>
          </div>
        </div>
        <hr className="mb-3" />

          <NavLink to={`/details/${item.id}`}>
          <div className="flex items-center justify-between mt-3">

<PrimaryButton className="rounded-lg text-sm" onClick={(e) => window.navigator}>
    Place Bid
  </PrimaryButton>
  <PrimaryButton className="rounded-lg px-4 py-3">
    <MdOutlineFavorite size={20} />
  </PrimaryButton>
</div>
          </NavLink>

      </div>
    </div>
  );
};

ProductCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    productDto: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      productStatus: PropTypes.string.isRequired,
      productImages: PropTypes.arrayOf(
        PropTypes.shape({
          imageUrl: PropTypes.string.isRequired,
          isPrimary: PropTypes.bool.isRequired,
        })
      ),
    }).isRequired,
    endTime: PropTypes.string.isRequired,
    currentPrice: PropTypes.number.isRequired,
    bidCount: PropTypes.number.isRequired,
  }).isRequired,
};

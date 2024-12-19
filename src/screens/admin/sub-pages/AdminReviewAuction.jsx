import React, { useEffect, useState } from "react";
import { PhotoUpload } from "../../seller-hub/components/PhotoUpload";
import { ProductDetails } from "../../seller-hub/components/ProductDetails";
import { ItemSpecifics } from "../../seller-hub/components/ItemSpecifics";
import { AuctionSettings } from "../../seller-hub/components/AuctionSettings";
import { useNavigate, useParams } from "react-router-dom";
import AuctionService from "../../../services/auctionService";
import ProductService from "../../../services/productService";
import { useWarning } from "../../../router";
import { useNotification } from "../../../notifications/NotificationContext";
import ProductImageDto from "../../../dto/ProductImageDto";

export const AdminReviewAuction = () => {
  const { showWarning } = useWarning();
  const navigate = useNavigate();
  const { showToastNotification } = useNotification();
  const { auctionId } = useParams();
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState({
    title: '',
    itemCategory: [],
    specifics: {},
    stockQuantity: 1,
    photos: [],
    videos: [],
    photoPrimaryIndex: 0,
  });

  const [auctionSettings, setAuctionSettings] = useState({
    title: "",
    startTime: "",
    endTime: "",
    startPrice: "",
    minimumBidIncrement: "",
  });

  const handleApprove = async () => {
    setLoading(true);
    showWarning(
      <div>
        <h2 className="text-lg font-semibold mb-2 text-center">Are you sure you want to approve this auction?</h2>
        <p className="text-center">This action cannot be undone.</p>
      </div>,
      async () => {
        try {
          await AuctionService.openAuction(auctionId);
          showToastNotification("Auction approved successfully", "success");
        } catch (error) {
          console.error("Error approving auction:", error);
          showToastNotification("Failed to approve auction", "error");
        } finally {
          setLoading(false);
          navigate("/admin/auction-management"); 
        }
      }
    );
  };

  const handleReject = async () => {
    setLoading(true);
    showWarning(
      <div>
        <h2 className="text-lg font-semibold mb-2 text-center">Are you sure you want to reject this auction?</h2>
        <p className="text-center">This action cannot be undone.</p>
      </div>,
      async () => {
        try {
          await AuctionService.cancelAuction(auctionId);
          showToastNotification("Auction rejected successfully", "success");
        } catch (error) {
          console.error("Error rejecting auction:", error);
          showToastNotification("Failed to reject auction", "error");
        } finally {
          setLoading(false);
          navigate("/admin/auction-management");
        }
      }
    );
  };

  useEffect(() => {
    const fetchAuctionAndLoadAssets = async () => {
      setLoading(true);
      try {
        // Lấy dữ liệu sản phẩm từ API
        const auction = (await AuctionService.getAuctionById(auctionId)).data;
        const product = (await ProductService.getProduct(auction.productDto.id)).data; // api get auction không trả về product
        console.log('Auction:', auction);
        console.log('Product:', product);
  
        setProductDetails({
          title: product.name,
          itemCategory: product.categories,
          specifics: JSON.parse(product.description), // Convert JSON string to object
          stockQuantity: product.stockQuantity,
          photos: product.productImages.map((productImageDto) => productImageDto.imageUrl),
          videos: [],
          photoPrimaryIndex: 0,
        });
        setAuctionSettings({
          title: auction.title,
          startTime: new Date(auction.startTime),
          endTime: new Date(auction.endTime),
          startPrice: auction.startingPrice,
          minimumBidIncrement: auction.minimumBidIncrement,
        });
      } catch (error) {
        console.error('Error fetching product:', error);
        if (error?.response?.data?.code === 5001) {
          console.log("Invalid Auction ID");
          showWarning(
            <div>
              <h2 className="text-lg font-semibold mb-2 text-center">Invalid Auction ID for review</h2>
            </div>,
            () => {}
          );
        }
        navigate("/admin")
      } finally {
        setLoading(false);
      }
    };
  
    fetchAuctionAndLoadAssets();
  }, [auctionId]);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Reviewing Auction: <span className="text-green">{auctionSettings.title}</span>
      </h1>
      <PhotoUpload
        productDetails={productDetails}
        setProductDetails={() => {}}
        disabled={true}
      />
      <ProductDetails
        productDetails={productDetails}
        setProductDetails={() => {}}
        disabled={true}
      />
      <ItemSpecifics
        productDetails={productDetails}
        setProductDetails={() => {}}
        disabled={true}
      />
      <div className="mb-10 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">STOCK QUANTITY</h2>
        <input
          type="number"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          value={productDetails.stockQuantity}
          readOnly
          disabled={true}
        />
      </div>
      <AuctionSettings
        auctionSettings={auctionSettings}
        setAuctionSettings={() => {}}
        disabled={true}
      />
      <div className="mt-8 flex flex-col space-y-4 items-center">
        <button
          className="w-52 py-2 bg-green text-white border border-gray-300 rounded-full"
          onClick={handleApprove}
          disabled={loading}
        >
          Approve Auction
        </button>
        <button
          className="w-52 py-2 bg-red-500 text-white border border-gray-300 rounded-full"
          onClick={handleReject}
          disabled={loading}
        >
          Reject Auction
        </button>
      </div>
    </div>
  );
};

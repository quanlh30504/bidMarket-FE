import React, { useState } from "react";
import { PhotoUpload } from "../components/PhotoUpload";
import { ProductDetails } from "../components/ProductDetails";
import { ItemSpecifics } from "../components/ItemSpecifics";
import { AuctionSettings } from "../components/AuctionSettings";

export const AdminReviewAuction = ({ productDetails, auctionSettings, onApprove, onReject }) => {
  // State để lưu trạng thái loading khi admin thực hiện duyệt hoặc từ chối
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(productDetails.id);
      alert("Auction approved successfully");
    } catch (error) {
      console.error("Error approving auction:", error);
      alert("Failed to approve auction");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await onReject(productDetails.id);
      alert("Auction rejected successfully");
    } catch (error) {
      console.error("Error rejecting auction:", error);
      alert("Failed to reject auction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Review Auction
      </h1>
      <PhotoUpload
        productDetails={productDetails}
        setProductDetails={() => {}}
      />
      <ProductDetails
        productDetails={productDetails}
        setProductDetails={() => {}}
      />
      <ItemSpecifics
        productDetails={productDetails}
        setProductDetails={() => {}}
      />
      <div className="mb-10 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">STOCK QUANTITY</h2>
        <input
          type="number"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          value={productDetails.stockQuantity}
          readOnly
        />
      </div>
      <AuctionSettings
        auctionSettings={auctionSettings}
        setAuctionSettings={() => {}}
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

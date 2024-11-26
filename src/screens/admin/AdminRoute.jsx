import { Routes, Route } from "react-router-dom";
import { Admin } from "./Admin";
import { UserManagement } from "./sub-pages/UserManagement";
import { AuctionManagement } from "./sub-pages/AuctionManagement";
import { AdminReviewAuction } from "./sub-pages/AdminReviewAuction";
import { useState } from "react";

export const AdminRoute = () => {
  const [productDetails, setProductDetails] = useState({
    title: 'Sample Product',
    itemCategory: { ELECTRONICS: 'Electronics' },
    specifics: { brand: 'Sample Brand', model: 'XYZ123' },
    stockQuantity: 10,
    photos: [],
    videos: [],
  });

  const [auctionSettings, setAuctionSettings] = useState({
    title: "Sample Auction",
    startTime: "",
    endTime: "",
    startPrice: 100.00,
    minimumBidIncrement: 10.00,
  });

  return (
    <Routes>
      <Route path="/" element={<Admin />}>
        <Route index element={<UserManagement />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="auction-management" element={<AuctionManagement />} />
        <Route path="review-auction" element={<AdminReviewAuction  productDetails={productDetails} auctionSettings={auctionSettings} onApprove={() => {}} onReject={() => {}} />} />
      </Route>
    </Routes>
  );
};

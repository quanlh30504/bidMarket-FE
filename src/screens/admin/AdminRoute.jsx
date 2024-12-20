import { Routes, Route } from "react-router-dom";
import { Admin } from "./Admin";
import { UserManagement } from "./sub-pages/UserManagement";
import { AuctionManagement } from "./sub-pages/AuctionManagement";
import { AdminReviewAuction } from "./sub-pages/AdminReviewAuction";

export const AdminRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Admin />}>
        <Route index element={<UserManagement />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="auction-management" element={<AuctionManagement />} />
        <Route path="review-auction/:auctionId" element={<AdminReviewAuction />} />
      </Route>
    </Routes>
  );
};

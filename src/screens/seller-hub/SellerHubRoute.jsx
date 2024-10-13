import { Routes, Route } from "react-router-dom";
import {
  SellerHub,
  Listings,
  Marketing,
  Orders,
  Overview,
  Payments,
  Performance,
  Reports,
  Research,
  Store,
} from "../../router/index.js";

export const SellerHubRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<SellerHub />}>
        <Route path="overview" element={<Overview />} />
        <Route path="orders" element={<Orders />} />
        <Route path="listings" element={<Listings />} />
        <Route path="marketing" element={<Marketing />} />
        <Route path="store" element={<Store />} />
        <Route path="performance" element={<Performance />} />
        <Route path="payments" element={<Payments />} />
        <Route path="reports" element={<Reports />} />
        <Route path="research" element={<Research />} />
      </Route>
    </Routes>
  );
};

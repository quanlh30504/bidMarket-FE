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
  Shipping,
  CreateProduct,
  CreateAuction,
} from "../../router/index.js";
import { EditProduct } from "./sub-pages/EditProduct.jsx";
import { EditAuction } from "./sub-pages/EditAuction.jsx";

export const SellerHubRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<SellerHub />}>
        <Route index element={<Overview />} /> {/* default route */}
        <Route path="overview" element={<Overview />} />
        <Route path="orders" element={<Orders />} />
        <Route path="listings" element={<Listings />} />
        <Route path="marketing" element={<Marketing />} />
        <Route path="store" element={<Store />} />
        <Route path="shipping" element={<Shipping />} />
        <Route path="performance" element={<Performance />} />
        <Route path="payments" element={<Payments />} />
        <Route path="reports" element={<Reports />} />
        <Route path="research" element={<Research />} />
        <Route path="create-product" element={<CreateProduct />} />
        <Route path="create-auction" element={<CreateAuction />} />
        <Route path="create-auction/:productId" element={<CreateAuction />} />
        <Route path="edit-product/:productId" element={<EditProduct />} />
        <Route path="edit-auction/:auctionId" element={<EditAuction />} />
      </Route>
    </Routes>
  );
};

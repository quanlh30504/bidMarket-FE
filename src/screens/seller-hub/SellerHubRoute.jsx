import { Routes, Route } from "react-router-dom";
import { SellerHub } from "./SellerHub";
import { Overview } from "./sub-pages/Overview";
import { Orders } from "./sub-pages/Orders";
import { Listings } from "./sub-pages/Listings";
import { Marketing } from "./sub-pages/Marketing";
import { Store } from "./sub-pages/Store";
import { Shipping } from "./sub-pages/Shipping";
import { Performance } from "./sub-pages/Performance";
import { Payments } from "./sub-pages/Payments";
import { Reports } from "./sub-pages/Reports";
import { Research } from "./sub-pages/Research";
import { CreateProduct } from "./sub-pages/CreateProduct";
import { CreateAuction } from "./sub-pages/CreateAuction";
import { EditProduct } from "./sub-pages/EditProduct.jsx";
import { EditAuction } from "./sub-pages/EditAuction.jsx";
import { ReopenAuction } from "./sub-pages/ReopenAuction.jsx";

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
        <Route path="reopen-auction/:auctionId" element={<ReopenAuction />} />
      </Route>
    </Routes>
  );
};

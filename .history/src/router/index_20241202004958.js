export { PrivateRoute } from "./PrivateRoute";
export { ScrollToTop } from "../utils/ScrollToTop";
export { NotFound } from "../components/common/NotFound";
export { WinningBidList } from "../screens/product/WinningBidList";
export { UserList } from "../admin/UserList";
export { UserProvider } from "../context/UserContext";

// Home Section
export { CategoryCard } from "../components/cards/CategoryCard";
export { CategorySlider } from "../components/hero/CategorySlider";
export { Hero } from "../components/hero/Hero";
export { Process } from "../components/hero/Process";
export { TopCollection } from "../components/hero/TopCollection";
export { TopSeller } from "../components/hero/TopSeller";
export { Trust } from "../components/hero/Trust";
export { Home } from "../screens/home/Home";

//Admin Product  Routes
export { Dashboard } from "../screens/dashboard/Dashboard";
export { AdminProductList } from "../admin/product/AdminProductList";
export { UpdateProductByAdmin } from "../admin/product/UpdateProductByAdmin";
export { Income } from "../admin/Income";

//Category  Routes
export { CreateCategory } from "../admin/category/CreateCategory";
export { UpdateCategory } from "../admin/category/UpdateCategory";
export { Catgeorylist } from "../admin/category/Catgeorylist";

//Product Routes
export { ProductsDetailsPage } from "../screens/product/ProductsDetailsPage";
export { ProductList } from "../screens/product/productlist/ProductList";
export { ProductEdit } from "../screens/product/ProductEdit";
export { AddProduct } from "../screens/product/AddProject";

// Utilis Routes
export { DateFormatter } from "../utils/DateFormatter";

// Common Routes
export { Loader } from "../components/common/Loader";
export { Search } from "../components/Search";
export { CategoryDropDown } from "../components/common/CategoryDropDown";
export { Title, Body, Caption, CustomLink, CustomNavLink, Container, PrimaryButton, ProfileCard, Heading, CustomNavLinkList } from "../components/common/Design";

// Layout Routes
export { DashboardLayout } from "../components/common/layout/DashboardLayout";
export { Layout } from "../components/common/layout/Layout";
export { ChatLayout } from "../components/common/layout/ChatLayout"

// Hook Routes
export { useUser } from "../context/UserContext";
export { useSignup } from "../hooks/useSignup";
export { useSignin } from "../hooks/useSignin";
export { useOtpService } from "../hooks/useOtpService";

// Auth Routes
export { UserProfile } from "../screens/auth/UserProfile";

// SearchList
export {SearchList} from "../screens/search/Search";


// Seller Hub Routes
export { SellerHubRoute } from "../screens/seller-hub/SellerHubRoute";
export { SellerHub } from "../screens/seller-hub/SellerHub";
export { Overview } from "../screens/seller-hub/sub-pages/Overview";
export { Orders } from "../screens/seller-hub/sub-pages/Orders";
export { Listings } from "../screens/seller-hub/sub-pages/Listings";
export { Marketing } from "../screens/seller-hub/sub-pages/Marketing";
export { Payments } from "../screens/seller-hub/sub-pages/Payments";
export {Performance} from "../screens/seller-hub/sub-pages/Performance";
export { Reports } from "../screens/seller-hub/sub-pages/Reports";
export { Research } from "../screens/seller-hub/sub-pages/Research";
export { Store } from "../screens/seller-hub/sub-pages/Store";
export { CreateProduct } from "../screens/seller-hub/sub-pages/CreateProduct";
export { CreateAuction } from "../screens/seller-hub/sub-pages/CreateAuction";


// Enum Routes
export { AuctionStatus, ProductStatus, OrderStatus } from "../screens/seller-hub/Enum/StatusType";


// Chat
export { Chat } from "../screens/chat/Chat";

//Profile
export { Account } from "../screens/profile/Account";
export { Tab } from "../screens/profile/Tab";
export { Order } from "../screens/profile/Order";
export { Payment } from "../screens/profile/Payment";
export { Shipping } from "../screens/profile/Shipping";
export { Watchlist} from "../screens/profile/Watchlist";

// Services Routes
export { authService } from "../services/authService";
export { default as axiosClient } from "../services/axiosClient";

// Combine Routes
export { AuthRoute } from "../screens/auth/AuthRoute";

// Pagination
export { Pagination } from "../components/pagination";

//shop view
export { ShopView } from "../screens/shop/shopView";

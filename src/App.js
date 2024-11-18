import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  LoginAsSeller,
  Register,
  Login,
  UserProfile,
  DashboardLayout,
  Layout,
  CreateCategory,
  UpdateCategory,
  Catgeorylist,
  UpdateProductByAdmin,
  AdminProductList,
  Income,
  Dashboard,
  ProductList,
  ProductEdit,
  AddProduct,
  ProductsDetailsPage,
  Home,
  UserList,
  WinningBidList,
  NotFound,
  ScrollToTop,
  PrivateRoute,
  UserProvider,
  SearchList,
  ChatLayout,
  Chat,
  Account,
  Tab,
  Watchlist,
  Order,
  Shipping,
  Payment
} from "./router/index.js";
import {NotificationProvider} from "./notifications/NotificationContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
          <BrowserRouter>
      <UserProvider>
            <NotificationProvider>
            <ScrollToTop />
            <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
            path="/search"
            element={
              <Layout>
                <SearchList />
              </Layout>
            }
          />
            <Route
              path="/login"
              element={
                <Layout>
                  <Login />
                </Layout>
              }
            />
            <Route
              path="/seller/login"
              element={
                <PrivateRoute allowedRoles={["BIDDER", "SELLER", "ADMIN"]}>
                  <Layout>
                    <LoginAsSeller />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/register"
              element={
                <Layout>
                  <Register />
                </Layout>
              }
            />
            <Route
              path="/chat"
              element={
                <PrivateRoute allowedRoles={["bidder", "seller", "admin"]}>
                    <ChatLayout>
                      <Chat />
                    </ChatLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/add"
              element={
                <PrivateRoute allowedRoles={["SELLER", "ADMIN"]}>
                  <Layout>
                    <DashboardLayout>
                      <AddProduct />
                    </DashboardLayout>
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/income"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <Layout>
                    <DashboardLayout>
                      <Income />
                    </DashboardLayout>
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/product/update/:id"
              element={
                <PrivateRoute allowedRoles={["SELLER", "ADMIN"]}>
                  <Layout>
                    <DashboardLayout>
                      <ProductEdit />
                    </DashboardLayout>
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/details/:id"
              element={
                <Layout>
                  <ProductsDetailsPage />
                </Layout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={["BIDDER", "SELLER", "ADMIN"]}>
                  <Layout>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/product"
              element={
                <PrivateRoute allowedRoles={["SELLER", "ADMIN"]}>
                  <Layout>
                    <DashboardLayout>
                      <ProductList />
                    </DashboardLayout>
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/product/admin"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <Layout>
                    <DashboardLayout>
                      <AdminProductList />
                    </DashboardLayout>
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/product/admin/update/:id"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <Layout>
                    <DashboardLayout>
                      <UpdateProductByAdmin />
                    </DashboardLayout>
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/userlist"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <Layout>
                    <DashboardLayout>
                      <UserList />
                    </DashboardLayout>
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/winning-products"
              element={
                <PrivateRoute allowedRoles={["BIDDER", "SELLER", "ADMIN"]}>
                  <Layout>
                    <DashboardLayout>
                      <WinningBidList />
                    </DashboardLayout>
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute allowedRoles={["BIDDER", "SELLER", "ADMIN"]}>
                  <Layout>
                    <DashboardLayout>
                      <UserProfile />
                    </DashboardLayout>
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/category"
              element={
                <PrivateRoute allowedRoles={["SELLER", "ADMIN"]}>
                  <Layout>
                    <DashboardLayout>
                      <Catgeorylist />
                    </DashboardLayout>
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/category/create"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <Layout>
                    <DashboardLayout>
                      <CreateCategory />
                    </DashboardLayout>
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/category/update/:id"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <Layout>
                    <DashboardLayout>
                      <UpdateCategory />
                    </DashboardLayout>
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/*"
              element={
                <Layout>
                  <NotFound />
                </Layout>
              }
            />
            <Route
              path="/notfound"
              element={
                <Layout>
                  <NotFound />
                </Layout>
              }
            />
            <Route
              path="/profiletest"
              element={
                <PrivateRoute allowedRoles={["bidder"]}>
                  <Layout>
                    <Account/>
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/account"
              element={
                <PrivateRoute allowedRoles={["bidder"]}>
                  <Layout>
                    <Tab>
                    <Account/>
                    </Tab>
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/watchlist"
              element={
                <PrivateRoute allowedRoles={["bidder"]}>
                  <Layout>
                    <Tab>
                    <Watchlist/>
                    </Tab>
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/order"
              element={
                <PrivateRoute allowedRoles={["bidder"]}>
                  <Layout>
                    <Tab>
                    <Order/>
                    </Tab>
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/payment-history"
              element={
                <PrivateRoute allowedRoles={["bidder"]}>
                  <Layout>
                    <Tab>
                    <Payment/>
                    </Tab>
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/shipping"
              element={
                <PrivateRoute allowedRoles={["bidder"]}>
                  <Layout>
                    <Tab>
                    <Shipping/>
                    </Tab>
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    style={{ zIndex: 9999 }}
                />
            </NotificationProvider>
      </UserProvider>
          </BrowserRouter>
    </>
  );
}

export default App;

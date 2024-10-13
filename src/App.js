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
  SellerHubRoute,
} from "./router/index.js";

function App() {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
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
                <PrivateRoute allowedRoles={["bidder", "seller", "admin"]}>
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
              path="/add"
              element={
                <PrivateRoute allowedRoles={["seller", "admin"]}>
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
                <PrivateRoute allowedRoles={["admin"]}>
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
                <PrivateRoute allowedRoles={["seller", "admin"]}>
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
                <PrivateRoute allowedRoles={["bidder", "seller", "admin"]}>
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
                <PrivateRoute allowedRoles={["seller", "admin"]}>
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
                <PrivateRoute allowedRoles={["admin"]}>
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
                <PrivateRoute allowedRoles={["admin"]}>
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
                <PrivateRoute allowedRoles={["admin"]}>
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
                <PrivateRoute allowedRoles={["bidder", "seller", "admin"]}>
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
                <PrivateRoute allowedRoles={["bidder", "seller", "admin"]}>
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
                <PrivateRoute allowedRoles={["seller", "admin"]}>
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
                <PrivateRoute allowedRoles={["admin"]}>
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
                <PrivateRoute allowedRoles={["admin"]}>
                  <Layout>
                    <DashboardLayout>
                      <UpdateCategory />
                    </DashboardLayout>
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/seller-hub/*"
              element={
                <PrivateRoute allowedRoles={["seller"]}>
                  <Layout>
                    <SellerHubRoute />
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
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  );
}

export default App;

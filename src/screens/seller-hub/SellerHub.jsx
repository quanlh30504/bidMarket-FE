import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Container, Title, CustomNavLinkList } from "../../components/common/Design";
import { authService } from "../../router";

export const SellerHub = () => {
  const location = useLocation(); // Lấy thông tin URL hiện tại

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking auth...");
        await authService.refreshToken();  // sync role from server
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    };
    checkAuth();
  }, []);

  return (
    <Container>
      <Title level={1} className="mb-6 text-center">Seller Hub</Title>
      <nav className="flex space-x-6 mb-8">
        <CustomNavLinkList href="/seller-hub/overview" isActive={location.pathname === '/seller-hub/overview' || location.pathname === '/seller-hub'}>
          Overview
        </CustomNavLinkList>
        <CustomNavLinkList href="/seller-hub/orders" isActive={location.pathname === '/seller-hub/orders'}>
          Orders
        </CustomNavLinkList>
        <CustomNavLinkList href="/seller-hub/listings" isActive={location.pathname === '/seller-hub/listings'}>
          Listings
        </CustomNavLinkList>
        {/* <CustomNavLinkList href="/seller-hub/shipping" isActive={location.pathname === '/seller-hub/shipping'}>
          Shipping
        </CustomNavLinkList> */}
        {/* <CustomNavLinkList href="/seller-hub/marketing" isActive={location.pathname === '/seller-hub/marketing'}>
          Marketing
        </CustomNavLinkList>
        <CustomNavLinkList href="/seller-hub/store" isActive={location.pathname === '/seller-hub/store'}>
          Store
        </CustomNavLinkList>
        <CustomNavLinkList href="/seller-hub/performance" isActive={location.pathname === '/seller-hub/performance'}>
          Performance
        </CustomNavLinkList>
        <CustomNavLinkList href="/seller-hub/payments" isActive={location.pathname === '/seller-hub/payments'}>
          Payments
        </CustomNavLinkList>
        <CustomNavLinkList href="/seller-hub/research" isActive={location.pathname === '/seller-hub/research'}>
          Research
        </CustomNavLinkList>
        <CustomNavLinkList href="/seller-hub/reports" isActive={location.pathname === '/seller-hub/reports'}>
          Reports
        </CustomNavLinkList> */}
        {/* <CustomNavLinkList href="/seller-hub/create-product" isActive={location.pathname === '/seller-hub/create-product'}>
          Create Product
        </CustomNavLinkList>
        <CustomNavLinkList href="/seller-hub/create-auction" isActive={location.pathname === '/seller-hub/create-auction'}>
          Create Auction
        </CustomNavLinkList> */}
      </nav>
      
      <Outlet /> {/* nested routes */}
    </Container>
  );
};

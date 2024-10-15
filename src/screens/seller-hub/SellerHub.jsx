import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Container, Title, CustomNavLinkList } from "../../components/common/Design";

export const SellerHub = () => {
  const location = useLocation(); // Lấy thông tin URL hiện tại

  return (
    <Container>
      <Title level={1} className="mb-6 text-center">Seller Hub</Title>
      <nav className="flex space-x-6 mb-8">
        <CustomNavLinkList href="/seller-hub/overview" isActive={location.pathname === '/seller-hub/overview'}>
          Overview
        </CustomNavLinkList>
        <CustomNavLinkList href="/seller-hub/orders" isActive={location.pathname === '/seller-hub/orders'}>
          Orders
        </CustomNavLinkList>
        <CustomNavLinkList href="/seller-hub/listings" isActive={location.pathname === '/seller-hub/listings'}>
          Listings
        </CustomNavLinkList>
        <CustomNavLinkList href="/seller-hub/marketing" isActive={location.pathname === '/seller-hub/marketing'}>
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
        </CustomNavLinkList>
      </nav>
      
      <Outlet /> {/* nested routes */}
    </Container>
  );
};

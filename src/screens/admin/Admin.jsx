import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Container, Title, CustomNavLinkList } from "../../components/common/Design";

export const Admin = () => {
  const location = useLocation();

  return (
    <Container>
      <Title level={1} className="mb-6 text-center">Admin Dashboard</Title>
      <nav className="flex space-x-6 mb-8">
        <CustomNavLinkList href="/admin/user-management" isActive={location.pathname === '/admin/user-management'}>
          User Management
        </CustomNavLinkList>
        <CustomNavLinkList href="/admin/auction-management" isActive={location.pathname === '/admin/auction-management'}>
          Auction Management
        </CustomNavLinkList>
      </nav>
      <Outlet /> {/* Nested routes */}
    </Container>
  );
};

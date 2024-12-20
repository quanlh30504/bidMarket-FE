import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Container, Title, CustomNavLinkList } from "../../components/common/Design";
import { authService } from "../../router";

export const Admin = () => {
  const location = useLocation();

  // Run 1 time when load Admin page, sync role from server to get real role
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking auth...");
        await authService.refreshToken();
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    };
    checkAuth();
  }, []);

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

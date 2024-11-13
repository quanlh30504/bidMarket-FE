import React from "react";
import { Header } from "../Header";
import { Footer } from "../Footer";

export const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main class="mt-20">{children}</main>
      <Footer />
    </>
  );
};

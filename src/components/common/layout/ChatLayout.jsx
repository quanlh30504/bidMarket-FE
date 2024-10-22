import React from "react";
import { Header } from "../Header";

export const ChatLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

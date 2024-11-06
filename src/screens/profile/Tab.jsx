import { NavLink, useLocation } from "react-router-dom";
import { Container } from "../../router";

export const Tab = ({ children }) => {
  const location = useLocation();

  // Function to check if the link is active
  const getLinkClass = (path) => {
    return location.pathname === path
      ? "bg-green text-white rounded-md px-10 py-4 text-black shadow-s3"
      : "bg-white text-black rounded-md px-10 py-4 shadow-s3";
  };

  return (
    <section className="pt-24 px-8">
      <Container>
        <div className="details mt-8">
          <div className="flex items-center gap-5">
            <NavLink to="/account" className={getLinkClass("/account")}>
              Account
            </NavLink>
            <NavLink to="/watchlist" className={getLinkClass("/watchlist")}>
              Watchlist
            </NavLink>
            <NavLink to="/order" className={getLinkClass("/order")}>
              Order
            </NavLink>
            <NavLink
              to="/payment-history"
              className={getLinkClass("/payment-history")}
            >
              Payment History
            </NavLink>
            <NavLink to="/shipping" className={getLinkClass("/shipping")}>
              Shipping
            </NavLink>
          </div>

          <div className="tab-content mt-8">{children}</div>
        </div>
      </Container>
    </section>
  );
};
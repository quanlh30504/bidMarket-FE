import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// design
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import { authService, Container, CustomNavLink, CustomNavLinkList, ProfileCard } from "../../router";
import { menulists } from "../../utils/data";
import { useUser } from "../../router";
import { NotificationBell } from "../../notifications/NotificationBell";
import { IoIosArrowDropdown } from "react-icons/io";
import { useWarning } from "../../router";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { avatarUrl, user } = useUser();
  const menuRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { showWarning } = useWarning();

  const toggleDropdown = () => {
    console.log("toggleDropdown");
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenuOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  const handleLogout = () => {
    showWarning(
      <h1 className="text-red-500 text-2xl font-semibold text-center pb-8">
        Are you sure you want to logout?
      </h1>,
      async () => {
        await authService.logout();
    });
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeMenuOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", closeMenuOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isHomePage = location.pathname === "/";
  const isChatPage = location.pathname === "/chat";

  const role = user.role;
  
  return (
    <>
      <header className={(isHomePage ? `header py-1 bg-primary ${isScrolled ? "scrolled" : ""}` : (isChatPage ? "header py-1 bg-primary" : `header bg-white shadow-s1 ${isScrolled ? "scrolled" : ""}`))}>
        <Container>
          <nav className="p-4 flex justify-between items-center relative">
            <div className="flex items-center gap-14">
              <div>
                {(isHomePage || isChatPage) && !isScrolled ? (
                  <img src="../images/common/header-logo.png" alt="LogoImg" className="h-11" />
                ) : (
                  <img src="../images/common/header-logo2.png" alt="LogoImg" className="h-11" />
                )}
              </div>
              <div className="hidden lg:flex items-center justify-between gap-8">
                {menulists.map((list) => (
                  (list.id !== 7 || role === "SELLER") && 
                  (list.id !== 8 || role === "ADMIN") &&
                  (
                    <li key={list.id} className="capitalize list-none">
                      <CustomNavLinkList href={list.path} isActive={location.pathname === list.path} className={`${isScrolled || (!isHomePage && !isChatPage) ? "text-black" : "text-white"}`}>
                        {list.link}
                      </CustomNavLinkList>
                    </li>
                  )
                  
                ))}
              </div>
            </div>
            <div className="flex items-center gap-8 icons">
              <div className="hidden lg:flex lg:items-center lg:gap-8">
                <IoSearchOutline size={23} className={`${isScrolled || !isHomePage ? "text-black" : "text-white"}`} />
                {role === "BIDDER" && (
                  <CustomNavLink href="/seller/login" className={`${isScrolled || !isHomePage ? "text-black" : "text-white"}`}>
                    Become a Seller
                  </CustomNavLink>
                )}

                {role === null ? (
                  <div className="flex items-center gap-8">
                    <CustomNavLink href="/auth/login" className={`${isScrolled || !isHomePage ? "text-black" : "text-white"}`}>
                      Sign in
                    </CustomNavLink>
                    <CustomNavLink href="/auth/register" className={`${!isHomePage || isScrolled ? "bg-green" : "bg-white"} px-8 py-2 rounded-full text-primary shadow-md`}>
                      Join
                    </CustomNavLink>
                  </div>
                ) : (
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4">
                      {user.role && <NotificationBell />}
                    </div>
                    <div className="relative">
                      <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
                        <ProfileCard>
                          <img src={avatarUrl} alt="" className="w-10 h-10 rounded-full" />
                          <IoIosArrowDropdown
                            size={17}
                            className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors text-emeral-700"
                          />
                        </ProfileCard>
                      </button>
                      {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                          <div onClick={(e) => {setIsDropdownOpen(false);}}>
                            <CustomNavLink href="/account" className="block px-4 py-2 text-black hover:bg-gray-200">
                              Account
                            </CustomNavLink>
                          </div>
                          <div onClick={(e) => {setIsDropdownOpen(false);}}>
                            <CustomNavLink href="/auth/change-password" className="block px-4 py-2 text-black hover:bg-gray-200">
                              Change Password
                            </CustomNavLink>
                          </div>
                          <button onClick={() => handleLogout()} className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200 text-[17px] font-medium cursor-pointer list-none hover:text-green transition-all ease-in-out ">
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                )}

              </div>
              <div
                className={`icon flex items-center justify-center gap-6 ${isScrolled || (!isHomePage && !isChatPage) ? "text-primary" : "text-white"}`}>
                <button onClick={toggleMenu} className="lg:hidden w-10 h-10 flex justify-center items-center bg-black text-white focus:outline-none">
                  {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                </button>
              </div>
            </div>

            <div ref={menuRef} className={`lg:flex lg:items-center lg:w-auto w-full p-5 absolute right-0 top-full menu-container ${isOpen ? "open" : "closed"}`}>
              {menulists.map((list) => (
                (list.id !== 7 || role === "SELLER") && (
                  <li href={list.path} key={list.id} className="uppercase list-none">
                    <CustomNavLink className="text-white">{list.link}</CustomNavLink>
                  </li>
                )
              ))}
            </div>
          </nav>
        </Container>
      </header>
    </>
  );
};

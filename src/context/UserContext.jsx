import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../router/index.js';
import { authUtils } from '../utils/authUtils.js';


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    role: null, // null, 'BIDDER', 'SELLER', 'ADMIN'
    // -> role !== null: user is logged in ('BIDDER', 'SELLER', 'ADMIN')
    // -> role === null: user is not
    UUID: "5eeea7fb-9adc-11ef-a43a-00155df1c39f" // Dummy UUID
  });
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState("https://cdn-icons-png.flaticon.com/128/6997/6997662.png");

  const RoleHandler = {
    setRole: (role) => {
      setUser(prevUser => ({ ...prevUser, role }));
    },
    deleteRole: () => {
      setUser(prevUser => ({ ...prevUser, role: null }));
    },
  };



  useEffect(() => {
    authService.setRoleHandler(RoleHandler);
    const fetchAccessToken = async () => {
      console.log('fetchAccessToken');
      // try to get new access token, if success means user is logged in (refreshToken is valid)
      try {
        await authService.refreshToken();
        const userInfo = await authUtils.getCurrentUserId();
        setAvatarUrl(userInfo.avatarUrl || "https://cdn-icons-png.flaticon.com/128/6997/6997662.png");
      } catch (error) {
        if (localStorage.getItem(authService.tokenKey) !== null) {
          authService.logout();
        } else {
          setUser({ role: null });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAccessToken();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, avatarUrl, setAvatarUrl }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

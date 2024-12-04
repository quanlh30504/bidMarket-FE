import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../router/index.js';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    role: null, // null, 'BIDDER', 'SELLER', 'ADMIN'
    // -> role !== null: user is logged in ('BIDDER', 'SELLER', 'ADMIN')
    // -> role === null: user is not
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
        
      } catch (error) {
        if (localStorage.getItem(authService.tokenKey) !== null) {
          authService.logout();
        } else {
          setUser({ role: null });
          setAvatarUrl(userInf("https://cdn-icons-png.flaticon.com/128/6997/6997662.png");

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

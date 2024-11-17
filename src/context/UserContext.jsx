import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../router/index.js';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    role: null, // null, 'BIDDER', 'SELLER', 'ADMIN'
    // -> role !== null: user is logged in ('BIDDER', 'SELLER', 'ADMIN')
    // -> role === null: user is not
    UUID: "5eeea7fb-9adc-11ef-a43a-00155df1c39f" // Dummy UUID
  });

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
        }
      };
    };

    fetchAccessToken();
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

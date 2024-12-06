import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../router/index.js';
import { axiosClient } from '../router/index.js';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    role: null,
    UUID: null,
  });
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState("https://cdn-icons-png.flaticon.com/128/6997/6997662.png");

  const UserHandler = {
    setRole: (role) => {
      setUser(prevUser => ({ ...prevUser, role }));
    },
    deleteRole: () => {
      setUser(prevUser => ({ ...prevUser, role: null }));
    },
    setUUID: (UUID) => {
      setUser(prevUser => ({ ...prevUser, UUID }));
    },
    deleteUUID: () => {
      setUser(prevUser => ({ ...prevUser, UUID: null }));
    },
  };

  useEffect(() => {
    authService.setUserHandler(UserHandler);
    const fetchAccessToken = async () => {
      console.log('fetchAccessToken');
      // try to get new access token, if success means user is logged in (refreshToken is valid)
      try {
        await authService.refreshToken();
        // setAvatarUrl("https://cdn-icons-png.flaticon.com/128/6997/6997662.png");
        if (user.UUID) {
          try {
            const response = await axiosClient.get(`/api/users/${user.UUID}/accountInfo`);
            if (response?.data?.avatarImageUrl) {
              setAvatarUrl(response.data.avatarImageUrl);
            }
          } catch (error) {
            console.error("Error fetching account info:", error);
          }
        }
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

  if (loading) {
    return <div>Loading...</div>; // Giao diện chờ
  }

  return (
    <UserContext.Provider value={{ user, loading, avatarUrl, setAvatarUrl }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

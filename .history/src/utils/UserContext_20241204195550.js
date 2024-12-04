import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [avatarUrl, setAvatarUrl] = useState("https://cdn-icons-png.flaticon.com/128/6997/6997662.png");

  return (
    <UserContext.Provider value={{ avatarUrl, setAvatarUrl }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
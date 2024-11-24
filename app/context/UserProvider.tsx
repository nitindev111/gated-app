import React, { createContext, useContext, useState, useEffect } from "react";
import { getDecodedToken } from "../utils/storageUtils";

interface UserContextType {
  user: any;
  setUser: (user: any) => void;
  clearUser: () => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<any> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const clearUser = () => {
    console.log("Clearing user");
    setUser(null);
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const decodedToken = await getDecodedToken();
      console.log("User loaded from AsyncStorage:", decodedToken);
      if (decodedToken) {
        setUser(decodedToken);
      } else {
        console.log("No token found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error retrieving token from AsyncStorage:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchSocietyDetails = () => {};
  useEffect(() => {
    console.log("====================================");
    console.log("use effect in user", user);
    console.log("====================================");

    fetchUser();
  }, [user?.user_id]);

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

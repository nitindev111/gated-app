import AsyncStorage from "@react-native-async-storage/async-storage";
import * as jwt_decode from "jwt-decode";

// Function to get data from AsyncStorage
export const getData = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error("Error getting data from AsyncStorage:", error);
    return null;
  }
};

// Function to get and decode the JWT token
export const getDecodedToken = async (): Promise<any | null> => {
  const token = await getData("gated_user");
  if (token) {
    try {
      const decoded = jwt_decode.jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return null;
    }
  }
  return null;
};

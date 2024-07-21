// utils/axiosInstance.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import * as jwtDecode from "jwt-decode";

const axiosInstance = axios.create({
  baseURL: "http://192.168.1.2:3000",
});

axiosInstance.interceptors.request.use(
  async (config: any) => {
    const token = await AsyncStorage.getItem("gated_user");
    console.log("token", token);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    console.log("====================================");
    console.log("config", config);
    console.log("====================================");
    return config;
  },
  (error: Error) => {
    console.log("====================================");
    console.log("here here", error);
    console.log("====================================");
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("====================================");
    console.log("error response", error.response);
    console.log("====================================");
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login page
      await AsyncStorage.removeItem("gated_user");
      router.navigate("/");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

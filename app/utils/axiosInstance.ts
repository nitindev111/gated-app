// utils/axiosInstance.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import * as jwtDecode from "jwt-decode";

const axiosInstance = axios.create({
  baseURL: "http://192.168.1.12:3000",
});

axiosInstance.interceptors.request.use(
  async (config: any) => {
    const token = await AsyncStorage.getItem("gated_user");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    console.log("config", config);

    return config;
  },
  (error: Error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem("gated_user");
      router.navigate("/");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

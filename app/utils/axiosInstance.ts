// utils/axiosInstance.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
// import https from "https";

let cachedToken: any = null;
// const httpsAgent = new https.Agent({ keepAlive: true });

const axiosInstance = axios.create({
  baseURL: "",
});

axiosInstance.interceptors.request.use(
  async (config) => {
    config.metadata = { startTime: new Date() };

    if (!cachedToken) {
      cachedToken = await AsyncStorage.getItem("gated_user");
    }

    if (cachedToken) {
      config.headers["Authorization"] = `Bearer ${cachedToken}`;
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    const endTime = new Date();
    const duration =
      endTime.getTime() - response.config?.metadata?.startTime.getTime();
    console.log(`Request to ${response.config.url} took ${duration}ms`);
    return response;
  },
  async (error) => {
    if (error.config && error.config.metadata) {
      const endTime = new Date();
      const duration =
        endTime.getTime() - error.config.metadata.startTime.getTime();
      console.log(`Request to ${error.config.url} failed after ${duration}ms`);
    }

    if (error.response && error.response.status === 401) {
      cachedToken = null;
      await AsyncStorage.removeItem("gated_user");
      router.navigate("/");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

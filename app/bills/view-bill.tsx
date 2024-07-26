import { View, Text } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import axiosInstance from "../utils/axiosInstance";

const ViewBill = () => {
  const [loading, setLoading] = useState(false);
  const { bill_id } = useLocalSearchParams();
  const [bill, setBill] = useState(null);

  const fetchBill = async () => {
    setLoading(true);
    const url =
      process.env.EXPO_PUBLIC_BACKEND_BASE_URL + `/bills/fetch?id=` + bill_id;
    try {
      const response = await axiosInstance.get(url);
      setBill(response.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };

  useState(async () => {
    await fetchBill();
  }, []);

  return (
    <View>
      <Text>{bill && JSON.stringify(bill).split(",")}</Text>
    </View>
  );
};

export default ViewBill;

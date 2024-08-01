import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axiosInstance from "../utils/axiosInstance";
import { FETCH_UNIT_BILLS } from "@/constants/api.constants";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RUPEE_SYMBOL } from "@/constants/others";
import { BACKEND_BASE_URL } from "@/config/config";

const UnitsList = () => {
  const [unitsData, setUnitsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useLocalSearchParams();
  const router = useRouter();

  const handleOnClick = (id: string, unit_number: string) => {
    router.push(`/bills/view-bill?bill_id=${id}&unit_number=${unit_number}`);
  };

  useEffect(() => {
    const fetchUnitBills = async () => {
      try {
        const { bill_name } = params;
        const url =
          BACKEND_BASE_URL + FETCH_UNIT_BILLS + "?bill_name=" + bill_name;
        const response = await axiosInstance.get(url);
        setUnitsData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch unit bills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnitBills();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-6 bg-white">
      {unitsData.map((unit: any, index) => (
        <TouchableOpacity
          key={index}
          className={`border border-gray-300 p-4 rounded-lg mb-4 bg-gray-50 shadow-sm flex-row items-start justify-between`}
          onPress={() =>
            handleOnClick(unit?.bill_id, unit.unit_info.unit_number)
          }
        >
          <Text className="text-sm font-bold mb-2">
            Unit {unit.unit_info.unit_number}
          </Text>
          <Text className="text-sm text-gray-600 mb-2">
            Amount: {RUPEE_SYMBOL}
            {unit.amount}
          </Text>
          <Text
            className={`text-sm font-bold ${
              unit.status === "PAID" ? "text-green-500" : "text-red-500"
            }`}
          >
            {unit.status}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default UnitsList;

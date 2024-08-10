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
import { BACKEND_BASE_URL } from "@/config/config";
import { styled } from "nativewind";

const UnitsList = () => {
  const [unitsData, setUnitsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, paid, unpaid
  const params = useLocalSearchParams();
  const router = useRouter();

  const handleOnClick = (id, unit_number) => {
    router.push(`/bills/view-bill?bill_id=${id}&unit_number=${unit_number}`);
  };

  const fetchUnitBills = async (filter) => {
    setLoading(true);
    try {
      const { bill_name } = params;
      let url = BACKEND_BASE_URL + FETCH_UNIT_BILLS + "?bill_name=" + bill_name;
      if (filter !== "all") {
        url += `&status=${filter.toUpperCase()}`;
      }
      const response = await axiosInstance.get(url);
      setUnitsData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch unit bills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnitBills(filter);
  }, [filter]);

  const FilterButton = styled(
    ({ title, selected, onPress }) => (
      <TouchableOpacity
        onPress={onPress}
        className={`py-2 px-4 rounded-full mx-1 ${
          selected ? "bg-green-600" : "bg-gray-200"
        }`}
      >
        <Text className={`font-bold ${selected ? "text-white" : "text-black"}`}>
          {title}
        </Text>
      </TouchableOpacity>
    ),
    ["py-2", "px-4", "rounded-full", "mx-1", "bg-gray-200", "bg-green-600"]
  );

  const filterOptions = [
    { title: "All", filter: "all" },
    { title: "Paid", filter: "paid" },
    { title: "Unpaid", filter: "unpaid" },
  ];

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-6 bg-white">
      <Text className="text-2xl font-bold mb-4">Bill: {params.bill_name}</Text>
      <View className="flex-row mb-4">
        {filterOptions.map((option) => (
          <FilterButton
            key={option.filter}
            title={option.title}
            selected={filter === option.filter}
            onPress={() => setFilter(option.filter)}
          />
        ))}
      </View>
      <Text className="text-lg font-bold mb-4">
        {unitsData.length} {unitsData.length === 1 ? "result" : "results"} found
      </Text>
      {unitsData.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">No bills to display</Text>
        </View>
      ) : (
        <ScrollView className="flex-1">
          {unitsData.map((unit, index) => (
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
      )}
    </View>
  );
};

export default UnitsList;

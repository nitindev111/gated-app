import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axiosInstance from "../utils/axiosInstance";
import { VIEW_BILLS_GROUPED } from "@/constants/api.constants";
import { RUPEE_SYMBOL } from "@/constants/others";
import { Link, router } from "expo-router";

const ViewBills = () => {
  const [billsData, setBillsData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const url =
          BACKEND_BASE_URL + VIEW_BILLS_GROUPED + "/668ec76634a193bb66e98ead";
        const response = await axiosInstance.get(url);
        console.log("response", response);

        setBillsData(response.data);
      } catch (error) {
        console.error("Failed to fetch bills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
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
      {billsData.map((billGroup: any, index) => (
        <TouchableOpacity
          key={index}
          className="border border-gray-300 p-4 rounded-lg mb-4 bg-white shadow-sm"
        >
          <Link
            href={{
              pathname: "/bills/bill-units-listing",
              params: { bill_name: billGroup.bill_name },
            }}
          >
            <View>
              <Text className="text-lg font-bold mb-2">
                {billGroup.bill_name}
              </Text>
              <Text className="text-sm text-gray-600 mb-2">
                Due Date:{" "}
                {new Date(billGroup.bills[0].due_date).toLocaleDateString()}
              </Text>
              <Text className="text-sm text-gray-600 mb-2">
                Total Amount: {RUPEE_SYMBOL} {billGroup.totalAmount}
              </Text>
              <Text className="text-sm text-gray-600">
                Number of Bills: {billGroup.bills.length}
              </Text>
            </View>
          </Link>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default ViewBills;

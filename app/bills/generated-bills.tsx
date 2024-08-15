import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import axiosInstance from "../utils/axiosInstance";
import { VIEW_BILLS_GROUPED } from "@/constants/api.constants";
import { RUPEE_SYMBOL } from "@/constants/others";
import { Link } from "expo-router";
import { BACKEND_BASE_URL } from "@/config/config";
import { useUser } from "../context/UserProvider";

const ViewBills = () => {
  const [billsData, setBillsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchBills = async () => {
    setLoading(true);
    try {
      const url =
        BACKEND_BASE_URL + VIEW_BILLS_GROUPED + "/" + user?.society_id;
      const response = await axiosInstance.get(url);
      console.log("response", response);

      setBillsData(response.data);
    } catch (error) {
      console.error("Failed to fetch bills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleDeleteBills = async (bill_name: string) => {
    setLoading(true);
    try {
      await axiosInstance.patch(`${BACKEND_BASE_URL}/bills/delete/by-name`, {
        data: { bill_name },
      });
      fetchBills();
    } catch (error) {
      console.error("Failed to delete bills:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (bill_name: string) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete all bills under '${bill_name}'?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteBills(bill_name),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (billsData.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-white">
        <Text className="text-lg text-gray-600">No bills to display</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-6 bg-gray-100">
      {billsData.map((billGroup: any, index: number) => (
        <View
          key={index}
          className="border border-gray-300 p-4 rounded-lg mb-4 bg-white shadow-lg"
        >
          <Link
            href={{
              pathname: "/bills/bill-units-listing",
              params: { bill_name: billGroup.bill_name },
            }}
          >
            <View>
              <Text className="text-lg font-bold mb-2 text-primary-800">
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
          <TouchableOpacity
            onPress={() => confirmDelete(billGroup.bill_name)}
            className="mt-4 bg-danger p-3 rounded-lg shadow-md"
          >
            <Text className="text-white text-center font-semibold">
              Delete All Bills
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default ViewBills;

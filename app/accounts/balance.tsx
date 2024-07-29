import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axiosInstance from "../utils/axiosInstance";
import { RUPEE_SYMBOL } from "@/constants/others";

const AccountsList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      const url = `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/accounts/view?society_id=668ec76634a193bb66e98ead`;

      try {
        const response = await axiosInstance.get(url); // Replace with the correct endpoint
        setAccounts(response.data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
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
      {accounts.map((account: any) => (
        <View
          key={account._id}
          className="p-4 mb-4 bg-white rounded-lg shadow-md border border-gray-200"
        >
          <Text className="text-lg font-bold mb-2 uppercase">
            {account.type}
          </Text>
          <Text className="text-sm text-gray-600 mb-2">
            {account.description}
          </Text>
          <Text className="text-xl text-green-500 font-semibold">
            Balance: {RUPEE_SYMBOL + account.balance}
          </Text>
          <Text className="text-xs text-gray-400 mt-2">
            Updated at: {new Date(account.updated_at).toUTCString()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default AccountsList;

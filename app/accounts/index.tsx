import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const ManageBills = () => {
  const router = useRouter();

  const handleSectionClick = (path: string) => {
    router.push(path);
  };

  return (
    <View className="flex-1 p-6 bg-gray-100">
      <TouchableOpacity
        className="bg-green-500 m-4 p-6 rounded-lg shadow-md"
        onPress={() => handleSectionClick("accounts/list")}
      >
        <Text className="text-lg font-bold text-white text-center">
          Accounts
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-green-500 m-4 p-6 rounded-lg shadow-md"
        onPress={() => handleSectionClick("accounts/add-income")}
      >
        <Text className="text-lg font-bold text-white text-center">
          Add Income
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-green-500 m-4 p-6 rounded-lg shadow-md"
        onPress={() => handleSectionClick("accounts/add-expense")}
      >
        <Text className="text-lg font-bold text-white text-center">
          Add Expense
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-green-500 m-4 p-6 rounded-lg shadow-md"
        onPress={() => handleSectionClick("accounts/transactions")}
      >
        <Text className="text-lg font-bold text-white text-center">
          Transactions
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ManageBills;

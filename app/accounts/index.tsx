import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const ACCOUNT_SECTIONS = [
  {
    name: "Accounts",
    icon: "users",
    path: "/accounts/list",
  },
  {
    name: "Transactions",
    icon: "users",
    path: "/accounts/transactions",
  },
  {
    name: "Income",
    icon: "money",
    path: "/accounts/add-income",
  },
  {
    name: "Expense",
    icon: "money",
    path: "/accounts/add-expense",
  },
];

const ManageBills = () => {
  const router = useRouter();

  const handleSectionClick = (path: string) => {
    router.push(path);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-row justify-around p-4">
        {ACCOUNT_SECTIONS.map((section: any, index) => {
          return (
            <TouchableOpacity
              className=" mt-4 rounded-lg shadow-md flex items-center"
              onPress={() => handleSectionClick(section.path)}
            >
              <FontAwesome
                name={section.icon}
                size={30}
                color={Colors.light.primary}
              />
              <Text className="text-sm text-center">{section.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default ManageBills;

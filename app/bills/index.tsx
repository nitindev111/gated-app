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
        onPress={() => handleSectionClick("bills/generate")}
      >
        <Text className="text-lg font-bold text-white text-center">
          Generate Maintenance Bills
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-green-500 m-4 p-6 rounded-lg shadow-md"
        onPress={() => handleSectionClick("/bills/generated-bills")}
      >
        <Text className="text-lg font-bold text-white text-center">
          View Generated Bills
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ManageBills;

import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import icons from "@/constants/icons";

const ManageBills = () => {
  const router = useRouter();

  const handleSectionClick = (path: string) => {
    router.push(path);
  };

  return (
    <View className="flex-1 p-2 bg-gray-100">
      <TouchableOpacity
        className="bg-white m-2 p-6 rounded-lg shadow-md flex-row items-center"
        onPress={() => handleSectionClick("bills/generate")}
      >
        <View className="w-[90%] pr-4">
          <Text className="text-lg font-bold">Generate Maintenance Bills</Text>
          <Text className="text-sm text-gray-600 mb-2">
            Generate the regular monthly bills for the society.
          </Text>
        </View>
        <View className="p-2 flex-1">
          <Image
            source={icons.rightArrow}
            style={{ width: 16, height: 16, tintColor: "gray" }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-white m-2 p-6 rounded-lg shadow-md flex-row items-center"
        onPress={() => handleSectionClick("/bills/generated-bills")}
      >
        <View className="w-[90%] pr-4">
          <Text className="text-lg font-bold">View Generated Bills</Text>
          <Text className="text-sm text-gray-600 mb-2">
            View List of bills generated previously.Bills can be identified
            using bill names.
          </Text>
        </View>
        <View className="p-2 flex-1">
          <Image
            source={icons.rightArrow}
            style={{ width: 16, height: 16, tintColor: "gray" }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ManageBills;

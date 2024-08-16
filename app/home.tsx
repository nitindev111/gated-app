import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage, {
  useAsyncStorage,
} from "@react-native-async-storage/async-storage";
import { useUser } from "./context/UserProvider";
import icons from "@/constants/icons";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const HOME_SECTIONS_ADMIN = [
  {
    name: "Accounting",
    path: "accounts",
    icon: "user",
  },
  {
    name: "Members",
    path: "/members",
    icon: "users",
  },
  // {
  //   name: "Downloads",
  //   label: "Downloads",
  //   path: "downloads",
  //   icon: "download",
  // },
  {
    name: "Manage Bills",
    label: "Manage Bills",
    path: "bills",
    icon: "file-pdf-o",
  },
  {
    name: "Logout",
    label: "Logout",
    path: "/logout",
    icon: "sign-out",
  },
];

const SectionCard: React.FC<{
  name: string;
  icon: any;
  onPress: () => void;
}> = ({ name, icon, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-gray-200 flex-1 m-4 justify-center items-center border border-solid border-gray-300 shadow-md"
  >
    {/* <Image source={icon} /> */}
    <FontAwesome name={icon} size={40} color={Colors.light.primary} />
    <Text className="text-sm">{name}</Text>
  </TouchableOpacity>
);

const Home = () => {
  const router = useRouter();
  const { user, clearUser } = useUser();
  console.log("user in home", user);

  const handleSectionClick = async (path: string) => {
    if (path.includes("logout")) {
      await AsyncStorage.removeItem("gated_user", () => {
        clearUser();
        router.replace("/");
      });
    } else {
      router.push(path);
    }
  };

  const renderSectionCards = () => {
    const sections = HOME_SECTIONS_ADMIN;
    return sections.map((section, index) => (
      <SectionCard
        key={index}
        name={section.name}
        icon={section.icon}
        onPress={() => handleSectionClick(section.path)}
      />
    ));
  };

  return (
    <View className="flex-1 p-2">
      <View className="h-[75%]">{renderSectionCards()}</View>
    </View>
  );
};

export default Home;

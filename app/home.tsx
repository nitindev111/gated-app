import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HOME_SECTIONS = [
  {
    name: "My bills",
    path: "bills",
    icon: "eye",
  },
  {
    name: "Members",
    path: "members",
    icon: "play",
  },
  {
    name: "Downloads",
    label: "Downloads",
    path: "downloads",
    icon: "profile",
  },
  {
    name: "Visitors",
    label: "Visitors",
    path: "visitors",
    icon: "bookmark",
  },
  {
    name: "Logout",
    label: "Logout",
    path: "/logout",
    icon: "bookmark",
  },
];

const HOME_SECTIONS_ADMIN = [
  {
    name: "Approve Bills",
    path: "bills",
    icon: "eye",
  },
  {
    name: "Members",
    path: "members",
    icon: "play",
  },
  {
    name: "Downloads",
    label: "Downloads",
    path: "downloads",
    icon: "profile",
  },
  {
    name: "Visitors",
    label: "Visitors",
    path: "visitors",
    icon: "bookmark",
  },
];

const SectionCard: React.FC<any> = ({ name, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-gray-200 m-2 flex-1 h-32 justify-center items-center"
  >
    <Text className="text-lg font-bold">{name}</Text>
  </TouchableOpacity>
);

const Home = () => {
  const router = useRouter();

  const handleSectionClick = async (path: string) => {
    if (path.includes("logout")) {
      await AsyncStorage.clear();
      router.replace("/");
    } else {
      router.push(path);
    }
  };

  const renderSectionCards = () => {
    const sections = HOME_SECTIONS;
    const rows = [];
    for (let i = 0; i < HOME_SECTIONS.length; i += 2) {
      const rowItems = HOME_SECTIONS.slice(i, i + 2).map((section, index) => (
        <SectionCard
          key={index}
          name={section.name}
          onPress={() => handleSectionClick(section.path)}
        />
      ));
      rows.push(
        <View key={i} className="flex-row">
          {rowItems}
        </View>
      );
    }
    return rows;
  };

  return <View className="flex-1 p-2">{renderSectionCards()}</View>;
};

export default Home;

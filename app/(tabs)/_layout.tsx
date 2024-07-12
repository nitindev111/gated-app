import { View, Text, Image, ImageSourcePropType } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import icons from "@/constants/icons";

type Props = {
  icon: ImageSourcePropType;
  color: string;
  name: string;
  focused: boolean;
};

const TabIcon = (props: Props) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={props?.icon}
        resizeMode="contain"
        tintColor={props.color}
        className="w-6 h-6"
      />
      <Text
        className={`${
          props?.focused ? "font-psemibold" : "font-pregular"
        } test-xs`}
        style={{ color: props?.color }}
      >
        {props.name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            headerTitle: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerTitle: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Proflie"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="payments"
          options={{
            headerTitle: "Payments",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bookmark}
                color={color}
                name="Payments"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;

import React, { useCallback } from "react";
import { Alert, BackHandler, Image, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, router } from "expo-router";
import { useTheme } from "react-native-paper";
import images from "@/constants/images";
import CustomButton from "./components/CustomButton";
import useAuthRedirect from "./hooks/useAuthRedirect";
import { UserProvider } from "./context/UserProvider";

if (__DEV__) {
  require("../ReactotronConfig");
}

const AppContent = () => {
  const theme = useTheme();
  useAuthRedirect();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Hold on!", "Are you sure you want to go back?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <GestureHandlerRootView>
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="w-full items-center justify-center h-full px-4">
            <Image
              source={images.logo}
              className="w-[130px] h-[84px]"
              resizeMode="contain"
            />
            <Image
              source={images.cards}
              className="w-[380px] h-[300px]"
              resizeMode="contain"
            />
            <Text className="text-secondary">this is some custom text</Text>
            <View className="pt-5"></View>
            <CustomButton
              title="Continue with Phone number"
              handlePress={() => {
                router.replace("login");
              }}
              isDisabled={false}
            />
          </View>
        </ScrollView>
        <StatusBar backgroundColor="#161622" style="light" />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const App = () => (
  <UserProvider>
    <AppContent />
  </UserProvider>
);

export default App;

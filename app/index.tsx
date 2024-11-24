import React, { useCallback, useEffect } from "react";
import { Alert, BackHandler, Image, Pressable, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, router } from "expo-router";
import { useTheme } from "react-native-paper";
import images from "@/constants/images";
import useAuthRedirect from "./hooks/useAuthRedirect";
import { UserProvider } from "./context/UserProvider";
import Button from "./components/common/Button";
import axiosInstance from "./utils/axiosInstance";

if (__DEV__) {
  require("../ReactotronConfig");
}

const AppContent = () => {
  const theme = useTheme();
  useAuthRedirect();

  useEffect(() => {
    const prewarmConnection = async () => {
      try {
        // Replace with a lightweight endpoint
        await axiosInstance.get("https://gateup.in/api/health?prewarm=tru");
        console.log("Connection prewarmed");
      } catch (error) {
        console.log("Prewarm connection failed", error);
      }
    };

    prewarmConnection();
  }, []);

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
    <SafeAreaView className="bg-white h-full">
      <GestureHandlerRootView>
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="flex-column flex-1 items-center justify-center gap-2">
            <Image
              source={images.gateup}
              className="w-[300px] h-[300px]"
              resizeMode="contain"
            />
            <View className="">
              <Button
                title="Continue with mobile number"
                disabled={false}
                onPress={() => {
                  router.replace("login");
                }}
              />
            </View>
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

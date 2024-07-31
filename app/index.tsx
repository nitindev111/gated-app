import React, { useCallback } from "react";
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
import CustomButton from "./components/CustomButton";
import useAuthRedirect from "./hooks/useAuthRedirect";
import { UserProvider } from "./context/UserProvider";
import Button from "./components/common/Button";

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
    <SafeAreaView className="bg-white h-full">
      <GestureHandlerRootView>
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="w-full items-center justify-start h-full px-4">
            <Image
              source={images.gateup}
              className="w-[380px] h-[300px]"
              resizeMode="cover"
            />
            <View className="pt-2">
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

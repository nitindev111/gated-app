// RootLayout.tsx
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { UserProvider, useUser } from "./context/UserProvider";
import { RootSiblingParent } from "react-native-root-siblings";
import { Text, View } from "react-native";
import { Colors } from "@/constants/Colors";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "tomato",
    secondary: "yellow",
  },
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Roboto-Black": require("../assets/fonts/Anek-Odia.ttf"),
  });

  useEffect((): any => {
    if (error) {
      throw error;
    }
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return (
    <PaperProvider theme={theme}>
      <UserProvider>
        <AppStack />
      </UserProvider>
    </PaperProvider>
  );
}

function AppStack() {
  const { user } = useUser();
  console.log("====================================");
  console.log("user in the app stack layout", user);
  console.log("====================================");
  return (
    <RootSiblingParent>
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.light.primary,
          },
        }}
      >
        <Stack.Screen options={{ headerShown: false }} name="index" />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="home"
          options={{
            headerBackVisible: false,
            headerShown: true,
            headerTitle: "",
          }}
        />
        <Stack.Screen name="bills" />
      </Stack>
    </RootSiblingParent>
  );
}

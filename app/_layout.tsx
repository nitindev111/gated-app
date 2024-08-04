// RootLayout.tsx
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { UserProvider, useUser } from "./context/UserProvider";

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
    "Roboto-Black": require("../assets/fonts/Roboto-Black.ttf"),
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
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />
      <Stack.Screen name="mark-paid" />
      <Stack.Screen name="approveBills" />
      <Stack.Screen name="bills" />
    </Stack>
  );
}

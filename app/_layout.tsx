import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { DefaultTheme, PaperProvider } from "react-native-paper";

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
    // SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Roboto-Black": require("../assets/fonts/Roboto-Black.ttf"),
  });

  useEffect((): any => {
    console.log("====================================");
    console.log("fonts loaded, ", fontsLoaded);
    console.log("====================================");
    if (error) {
      throw error;
    }
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
    if (!fontsLoaded && !error) {
      console.log("something is wrong", error);
    }
  }, [fontsLoaded]);

  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="index" />
      </Stack>
    </PaperProvider>
  );
}

// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import Login from "./screens/Login";
// import OTPVerification from "./screens/OTPVerification";
// import Search from "./screens/Search";

// type RootStackParamList = {
//   Login: undefined;
//   OTPVerification: { generatedOtp: number };
//   Search: undefined;
// };

// const Stack = createStackNavigator<RootStackParamList>();

// const App: React.FC = () => {
//   return (
//     <NavigationContainer independent>
//       <Stack.Navigator initialRouteName="Login">
//         <Stack.Screen name="Login" component={Login} />
//         <Stack.Screen name="OTPVerification" component={OTPVerification} />
//         <Stack.Screen name="Search" component={Search} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;

import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Alert, Image, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import CustomButton from "./components/CustomButton";
import { useTheme } from "react-native-paper";

export default function App() {
  const theme = useTheme();
  return (
    <SafeAreaView className="bg-primary h-full">
      <GestureHandlerRootView>
        <ScrollView
          contentContainerStyle={{
            height: "100%",
          }}
        >
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
                router.replace("bills");
              }}
            />
          </View>
        </ScrollView>
        <StatusBar backgroundColor="#161622" style="light" />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
  {
    /* <View className="flex-1 items-center justify-center">
        <Text className="text-3xl">this is test</Text>
        <Link href={"/home"}>Go to home</Link>
      </View> */
  }
}

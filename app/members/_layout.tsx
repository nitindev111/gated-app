import { Stack } from "expo-router";
import { UserProvider } from "../context/UserProvider";

export default function RootLayout() {
  return <AppStack />;
}

function AppStack() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </UserProvider>
  );
}

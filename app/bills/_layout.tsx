import { Stack } from "expo-router";
import { useEffect } from "react";
import { UserProvider } from "../context/UserProvider";

export default function RootLayout() {
  return <AppStack />;
}

function AppStack() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="generate"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="generated-bills"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="bill-units-listing"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="view-bill"
          options={{
            headerShown: true,
          }}
        />
      </Stack>
    </UserProvider>
  );
}

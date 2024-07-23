import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { UserProvider } from "../context/UserProvider";

export default function AuthLayout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="verify"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </UserProvider>
  );
}

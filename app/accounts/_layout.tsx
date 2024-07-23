import React from "react";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerBackButtonMenuEnabled: true,
      }}
    >
      <Stack.Screen
        name="main"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="bank"
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="cash"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

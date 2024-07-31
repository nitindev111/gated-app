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
        name="balance"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-income"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-expense"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="transactions"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

import React from "react";
import { Stack } from "expo-router";
import { UserProvider } from "../context/UserProvider";

export default function AuthLayout() {
  return (
    <UserProvider>
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
    </UserProvider>
  );
}

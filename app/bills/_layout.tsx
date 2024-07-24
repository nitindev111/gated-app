import { Stack } from "expo-router";
import { useEffect } from "react";


export default function RootLayout() {
    return (
        <AppStack />
    );
}

function AppStack() {

    return (
        <Stack>
            <Stack.Screen name="generate" />
            <Stack.Screen name="view" />
        </Stack>
    );
}

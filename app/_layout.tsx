import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { CityProvider } from "./hooks/cityContext";

export default function RootLayout() {
  return (
    <>
      <CityProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#25292e" },
            headerShadowVisible: false,
            headerTintColor: "#fff",
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </CityProvider>
    </>
  );
}

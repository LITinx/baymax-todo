import { Stack } from "expo-router";
import { useEffect } from "react";
import "./globals.css";
import { login } from "../services/appwrite";

export default function RootLayout() {
  useEffect(() => {
    const init = async () => {
      try {
        await login();
      } catch (error) {
        console.error("Error on login:", error);
      }
    };

    init();
  }, []);
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

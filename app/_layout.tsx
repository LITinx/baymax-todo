import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import "./globals.css";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import LoadingScreen from "../components/LoadingScreen";

function RootLayoutNav() {
  const { isAuthenticated, isAuthInitialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthInitialized) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to main app if authenticated and in auth screens
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isAuthInitialized, segments]);

  // Show loading screen while checking authentication
  if (!isAuthInitialized) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

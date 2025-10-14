import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from "../components/LoadingScreen";

export default function Index() {
  const { isAuthenticated, isAuthInitialized } = useAuth();

  // Show loading while checking auth status
  if (!isAuthInitialized) {
    return <LoadingScreen message="Loading..." />;
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}

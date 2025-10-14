import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import FormInput from "../../components/FormInput";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email.trim(), data.password);
      // Navigation will be handled automatically by the auth context
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Please try again");
    }
  };

  const goToRegister = () => {
    router.push("/(auth)/register");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="px-6"
        >
          <View className="flex-1 justify-center">
            {/* Header */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
                Welcome Back
              </Text>
              <Text className="text-gray-600 text-center">
                Sign in to your account
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              {/* Email Input */}
              <FormInput
                control={control}
                name="email"
                label="Email"
                placeholder="Enter your email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Please enter a valid email",
                  },
                }}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />

              {/* Password Input */}
              <FormInput
                control={control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                error={errors.password}
                secureTextEntry
                editable={!isLoading}
              />

              {/* Login Button */}
              <TouchableOpacity
                className={`bg-emerald-600 rounded-lg py-4 items-center mt-6 ${
                  isLoading ? "opacity-50" : ""
                }`}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                <Text className="text-white text-base font-semibold">
                  {isLoading ? "Signing In..." : "Sign In"}
                </Text>
              </TouchableOpacity>

              {/* Register Link */}
              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600">Don't have an account? </Text>
                <TouchableOpacity onPress={goToRegister} disabled={isLoading}>
                  <Text className="text-emerald-600 font-semibold">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

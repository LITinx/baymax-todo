import React from "react";
import {
  View,
  Text,
  TextInput,
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

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterScreen = () => {
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data.email.trim(), data.password);
      // Navigation will be handled automatically by the auth context
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message || "Please try again");
    }
  };

  const goToLogin = () => {
    router.push("/(auth)/login");
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
                Create Account
              </Text>
              <Text className="text-gray-600 text-center">
                Sign up to get started
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
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                }}
                error={errors.password}
                secureTextEntry
                editable={!isLoading}
              />

              {/* Confirm Password Input */}
              <FormInput
                control={control}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                rules={{
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                }}
                error={errors.confirmPassword}
                secureTextEntry
                editable={!isLoading}
              />

              {/* Register Button */}
              <TouchableOpacity
                className={`bg-emerald-600 rounded-lg py-4 items-center mt-6 ${
                  isLoading ? "opacity-50" : ""
                }`}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                <Text className="text-white text-base font-semibold">
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Text>
              </TouchableOpacity>

              {/* Login Link */}
              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600">Already have an account? </Text>
                <TouchableOpacity onPress={goToLogin} disabled={isLoading}>
                  <Text className="text-emerald-600 font-semibold">
                    Sign In
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

export default RegisterScreen;

import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Loading..." }) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#059669" />
        <Text className="text-gray-600 mt-4 text-base">{message}</Text>
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen;

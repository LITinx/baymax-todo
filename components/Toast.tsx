import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Undo2 } from "lucide-react-native";
import { scheduleOnRN } from "react-native-worklets";

interface ToastProps {
  visible: boolean;
  message: string;
  actionText?: string;
  onAction?: () => void;
  onDismiss: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  actionText,
  onAction,
  onDismiss,
  duration = 4000,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Animate in
      translateY.value = withTiming(0, { duration: 250 });
      opacity.value = withTiming(1, { duration: 250 });

      // Auto dismiss after duration
      setTimeout(() => {
        if (visible) {
          translateY.value = withTiming(100, { duration: 250 });
          opacity.value = withTiming(0, { duration: 250 }, (finished) => {
            if (finished) {
              scheduleOnRN(onDismiss);
            }
          });
        }
      }, duration);
    } else {
      // Animate out immediately
      translateY.value = withTiming(100, { duration: 250 });
      opacity.value = withTiming(0, { duration: 250 });
    }
  }, [visible, duration, onDismiss]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: "absolute",
          bottom: insets.bottom + 20,
          left: 20,
          right: 20,
          zIndex: 1000,
        },
      ]}
    >
      <View className="bg-gray-800 rounded-lg px-4 py-3 flex-row items-center justify-between shadow-lg">
        <Text className="text-white text-sm flex-1 mr-3">{message}</Text>
        {actionText && onAction && (
          <TouchableOpacity
            onPress={onAction}
            className="flex-row items-center bg-green-600 px-3 py-2 rounded-md"
            activeOpacity={0.8}
          >
            <Undo2 size={16} color="white" className="mr-1" />
            <Text className="text-white text-sm font-medium ml-1">
              {actionText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

export default Toast;

import { ITask, updateTask } from '@/services/appwrite';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutDown,
  interpolateColor,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

interface TodoItemProps {
  todo: ITask;
  onToggle?: (taskId: string, isCompleted: boolean) => void;
}

const TodoItem = ({ todo, onToggle }: TodoItemProps) => {
  const backgroundProgress = useSharedValue(0);

  const handleToggle = async () => {
    await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Gesture_Start);

    if (!todo.isCompleted) {
      // Green background flash
      backgroundProgress.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 400 })
      );

      if (onToggle) scheduleOnRN(onToggle, todo.$id, true);
    }

    const success = await updateTask(todo.$id, !todo.isCompleted);

    if (todo.isCompleted && success && onToggle) {
      scheduleOnRN(onToggle, todo.$id, false);
    }
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return null;

    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset hours
    const onlyDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    onlyDate.setHours(0, 0, 0, 0);

    const timeString = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });

    if (onlyDate.getTime() === today.getTime()) {
      return { text: `Today ${timeString}`, status: 'today' };
    } else if (onlyDate.getTime() === tomorrow.getTime()) {
      return { text: `Tomorrow ${timeString}`, status: 'tomorrow' };
    } else if (onlyDate < today) {
      return {
        text: `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${timeString}`, status: 'overdue'
      };
    } else {
      return {
        text: `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${timeString}`,
        status: 'future'
      };
    }
  };
  const dueDate = formatDueDate(todo.dueDate);


  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      backgroundProgress.value,
      [0, 1],
      ['rgba(255, 255, 255, 0.9)', 'rgba(34, 197, 94, 0.3)']
    );

    return {
      backgroundColor,
    };
  });

  return (
    <View className="mx-4 mb-3">
      <Animated.View
        layout={LinearTransition.springify()}
        entering={FadeInDown}
        exiting={FadeOutDown}
      >
        <TouchableOpacity
          onPress={handleToggle}
          activeOpacity={0.7}
        >
          <Animated.View
            style={animatedBackgroundStyle}
            className="rounded-md p-4 shadow-lg shadow-gray-400/50 border border-gray-200"
          >
            <View className="flex items-center justify-between flex-row gap-3">
              <View className="flex-1">
                <Text
                  className={`text-lg font-medium ${todo.isCompleted
                    ? 'text-gray-500 line-through'
                    : 'text-gray-800'
                    }`}
                >
                  {todo.title}
                </Text>
                {todo.description && (
                  <Text
                    className={`text-sm mt-1 ${todo.isCompleted
                      ? 'text-gray-400 line-through'
                      : 'text-gray-600'
                      }`}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {todo.description}
                  </Text>
                )}
                {dueDate && (
                  <Text
                    className={`text-xs mt-1 font-medium ${todo.isCompleted
                        ? 'text-gray-400 line-through'
                        : dueDate.status === 'overdue'
                          ? 'text-red-500'
                          : dueDate.status === 'today'
                            ? 'text-blue-500'
                            : dueDate.status === 'future' || dueDate.status === 'tomorrow'
                              ? 'text-green-500'
                              : 'text-gray-500'
                      }`}
                  >
                    {dueDate.text}
                  </Text>
                )}
              </View>

              <View
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${todo.isCompleted
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 bg-white'
                  }`}
              >
                {todo.isCompleted && (
                  <Text className="text-white text-xs font-bold">✓</Text>
                )}
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default TodoItem;

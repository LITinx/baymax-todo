import { ITask, updateTask } from '@/services/appwrite';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

interface TodoItemProps {
  todo: ITask;
  onToggle?: (taskId: string, isCompleted: boolean) => void;
}

const TodoItem = ({ todo, onToggle }: TodoItemProps) => {
  const [scaleAnimation] = useState(new Animated.Value(1));
  const [backgroundAnimation] = useState(new Animated.Value(0));
  const [slideAnimation] = useState(new Animated.Value(0));
  const [opacityAnimation] = useState(new Animated.Value(1));
  
  const handleToggle = async () => {
    await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Gesture_Start)
    // Start completion animation if completing task
    if (!todo.isCompleted) {
      // Scale bounce effect
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start();
      
      // Green background flash
      Animated.sequence([
        Animated.timing(backgroundAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundAnimation, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        })
      ]).start();
      
      // After the green flash, start slide-to-right animation
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnimation, {
            toValue: 300, // Slide 300 pixels to the right
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start(() => {
          // After animation completes, trigger the state update
          if (onToggle) {
            onToggle(todo.$id, true);
          }
        });
      }, 200); // Start slide animation after green flash completes
    }
    
    // Update the task immediately in the backend
    const success = await updateTask(todo.$id, !todo.isCompleted);
    
    // If unchecking a completed task, update immediately
    if (todo.isCompleted && success && onToggle) {
      onToggle(todo.$id, false);
    }
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Reset time for comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) {
      return "Today";
    } else if (date.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else if (date < today) {
      return "Overdue";
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const dueDateText = formatDueDate(todo.dueDate);
  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.isCompleted;

  const animatedBackgroundColor = backgroundAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0.9)', 'rgba(34, 197, 94, 0.3)'],
  });

  return (
    <View className="mx-4 mb-3">
      <Animated.View
        style={{
          transform: [
            { scale: scaleAnimation },
            { translateX: slideAnimation }
          ],
          opacity: opacityAnimation,
        }}
      >
        <TouchableOpacity 
          onPress={handleToggle}
          activeOpacity={0.7}
        >
          <Animated.View 
            style={{
              backgroundColor: animatedBackgroundColor,
            }}
            className="rounded-xl p-4 shadow-lg shadow-gray-300/50 border border-gray-100/50"
          >
        <View className="flex items-center justify-between flex-row gap-3">
          <View className="flex-1">
            <Text 
              className={`text-lg font-medium ${
                todo.isCompleted 
                  ? 'text-gray-500 line-through' 
                  : 'text-gray-800'
              }`}
            >
              {todo.title}
            </Text>
            {todo.description && (
              <Text 
                className={`text-sm mt-1 ${
                  todo.isCompleted 
                    ? 'text-gray-400 line-through' 
                    : 'text-gray-600'
                }`}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {todo.description}
              </Text>
            )}
            {dueDateText && (
              <Text 
                className={`text-xs mt-1 font-medium ${
                  todo.isCompleted 
                    ? 'text-gray-400 line-through'
                    : isOverdue 
                      ? 'text-red-500' 
                      : dueDateText === 'Today'
                        ? 'text-blue-500'
                        : 'text-gray-500'
                }`}
              >
                {dueDateText}
              </Text>
            )}
          </View>
          
          <View
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              todo.isCompleted 
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

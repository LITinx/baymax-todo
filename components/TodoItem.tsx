import { ITask, updateTask } from '@/services/appwrite';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface TodoItemProps {
  todo: ITask;
  onToggle?: (taskId: string, isCompleted: boolean) => void;
}

const TodoItem = ({ todo, onToggle }: TodoItemProps) => {
  const handleToggle = async () => {
    const success = await updateTask(todo.$id, !todo.isCompleted);
    if (success && onToggle) {
      onToggle(todo.$id, !todo.isCompleted);
    }
  };

  return (
    <View className="mx-4 mb-3">
      <TouchableOpacity 
        onPress={handleToggle}
        activeOpacity={0.7}
        className="bg-white/90 rounded-xl p-4 shadow-lg shadow-gray-300/50 border border-gray-100/50"
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
      </TouchableOpacity>
    </View>
  );
};

export default TodoItem;

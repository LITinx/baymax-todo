import { ITask } from '@/services/appwrite';
import React from 'react';
import { Text, View } from 'react-native';

const TodoItem = ({ todo }: { todo: ITask }) => {
  return (
    <View className="flex items-center justify-between flex-row gap-2 p-3">
      <Text className="text-lg">{todo.title}</Text>
      <View
        className={`w-5 h-5 rounded-full ${
          todo.isCompleted ? 'bg-black' : 'border border-black'
        }`}
      ></View>
    </View>
  );
};

export default TodoItem;

import React from 'react';

import {Text, View} from 'react-native';

const TodoItem = () => {
    return (
        <View className="flex items-center justify-between flex-row gap-2 p-3">
            <Text className="text-lg">Create list</Text>
            <View className="w-5 h-5 rounded-full bg-black">
            </View>
        </View>
    );
};

export default TodoItem;

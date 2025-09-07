import React from 'react';

import {Text, TextInput, View} from 'react-native';
import { useState } from 'react';

const CreateTodo = () => {
    const [todo, setTodo] = useState('');
    return (
        <View className="px-4 pb-4">
            <View className="bg-white/90 rounded-xl p-4 shadow-lg shadow-gray-300/50 border border-gray-100/50">
                <TextInput 
                    className="text-lg text-gray-800"
                    placeholder="What do you want to do today?"
                    placeholderTextColor="#9CA3AF"
                    value={todo}
                    onChangeText={setTodo}
                    onSubmitEditing={() => setTodo('')}
                    multiline
                    textAlignVertical="top"
                />
            </View>
        </View>
    );
};

export default CreateTodo;

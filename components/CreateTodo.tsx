import React from 'react';

import {Text, TextInput, View} from 'react-native';
import { useState } from 'react';

const CreateTodo = () => {
    const [todo, setTodo] = useState('');
    return (
        <View className="pb-safe">
            <Text>{todo}</Text>
            <TextInput className="p-4 border-b border-black rounded-full"
                       placeholder="What do you want to do today?"
                       value={todo}
                       onChangeText={setTodo}
                       onSubmitEditing={() => setTodo('')}/>
        </View>
    );
};

export default CreateTodo;

import React from 'react';

import {Alert, Text, TextInput, View} from 'react-native';
import { useState } from 'react';
import { createTask, ITask } from '@/services/appwrite';

interface CreateTodoProps {
    onTaskCreate?: (task: ITask) => void;
}

const CreateTodo = ({ onTaskCreate }: CreateTodoProps) => {
    const [todo, setTodo] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    
    const handleSubmit = async () => {
        if (!todo.trim() || isCreating) return;
        
        setIsCreating(true);
        try {
            const newTask = await createTask({ 
                title: todo.trim(),
                dueDate: new Date().toISOString().split('T')[0] // Default to today
            });
            
            if (newTask && onTaskCreate) {
                onTaskCreate(newTask);
                setTodo('');
            } else {
                Alert.alert('Error', 'Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            Alert.alert('Error', 'Failed to create task');
        } finally {
            setIsCreating(false);
        }
    };
    
    return (
        <View className="px-4 pb-4">
            <View className="bg-white/90 rounded-xl p-4 shadow-lg shadow-gray-300/50 border border-gray-100/50">
                <TextInput 
                    className="text-lg text-gray-800"
                    placeholder="What do you want to do today?"
                    placeholderTextColor="#9CA3AF"
                    value={todo}
                    onChangeText={setTodo}
                    onSubmitEditing={handleSubmit}
                    multiline={false}
                    editable={!isCreating}
                    returnKeyType="done"
                    blurOnSubmit
                />
            </View>
        </View>
    );
};

export default CreateTodo;

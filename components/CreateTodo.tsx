import React from "react";

import { ITask, createTask } from "@/services/appwrite";
import { structuredTaskLLM } from "@/services/langchain";
import { useTasksStore } from "@/services/store";
import { handleTaskAction } from "@/services/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, TextInput, TouchableOpacity, View } from "react-native";
interface CreateTodoProps {
    onTaskCreate?: (task: ITask) => void;
}

const CreateTodo = ({ onTaskCreate }: CreateTodoProps) => {
    const [todo, setTodo] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const isAiMode = useTasksStore(state => state.aiMode)
    const setIsAiMode = useTasksStore(state => state.updateAiMode)

    const handleSubmit = async () => {
        if (!todo.trim() || isCreating) return;
        setIsCreating(true);
        try {
            let newTask: ITask | null = null;

            if (isAiMode) {
                // Use AI to parse and create task
                const response = await structuredTaskLLM.invoke(`${todo.trim()}, today's date is ${new Date()} if you need `);
                newTask = await handleTaskAction(response);
            } else {
                // Create task directly without AI
                newTask = await createTask({
                    title: todo.trim(),
                    description: "",
                    dueDate: undefined
                });
            }

            if (newTask && onTaskCreate) {
                onTaskCreate(newTask);
                setTodo("");
            } else {
                Alert.alert("Error", "Failed to create task");
            }
        } catch (error) {
            console.error("Error creating task:", error);
            Alert.alert("Error", "Failed to create task");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <View className="px-4 pb-4 bg-transparent">

            {/* Input Field */}
            <View className="px-4 pb-4 bg-transparent">
                {/* Input Field with trailing AI icon button */}
                <View className="flex-row items-center justify-between bg-transparent rounded-full px-4 shadow-sm drop-shadow-sm shadow-gray-400/50 border border-gray-200">
                    <View className="py-3">
                        <TextInput
                            className="text-lg text-gray-800 py-1"
                            placeholder={isAiMode ? "Describe what you want to do..." : "What do you want to do today?"}
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
                    <View>
                        <TouchableOpacity
                            onPress={() => setIsAiMode(!isAiMode)}
                            className={`ml-2 w-8 h-8 rounded-full items-center justify-center`}
                            activeOpacity={0.7}
                        >
                            <MaterialCommunityIcons
                                name={isAiMode ? "star-four-points" : "star-four-points-outline"}
                                size={20}
                                color={isAiMode ? "#2563eb" : "#6B7280"}
                                className="shadow-lg"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default CreateTodo;

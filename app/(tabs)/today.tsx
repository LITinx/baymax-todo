import React from 'react';

import {KeyboardAvoidingView, Text, View} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import TodoItem from "@/components/TodoItem";
import CreateTodo from "@/components/CreateTodo";

const Today = () => {
    return (
        <SafeAreaView>
            <KeyboardAvoidingView behavior="padding" className="p-4 flex justify-between h-full">
                <View>
                    <View className="gap-4">
                        <Text className="text-4xl">Today</Text>
                        <View className="h-[1px] bg-black"></View>
                    </View>
                    <TodoItem></TodoItem>
                    <TodoItem></TodoItem>
                    <TodoItem></TodoItem>
                    <TodoItem></TodoItem>
                    <TodoItem></TodoItem>
                </View>
                <CreateTodo></CreateTodo>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Today;

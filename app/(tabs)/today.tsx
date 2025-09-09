import CreateTodo from "@/components/CreateTodo";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TodoItem from "../../components/TodoItem";
import { getTasks, ITask } from "../../services/appwrite";

export default function Today() {
  const [todos, setTodos] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleTodoToggle = (taskId: string, isCompleted: boolean) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.$id === taskId ? { ...todo, isCompleted } : todo
      )
    );
  };

  const handleTaskCreate = (newTask: ITask) => {
    setTodos(prevTodos => [newTask, ...prevTodos]);
  };

  // Filter to show only today's incomplete tasks
  const todaysIncompleteTodos = todos.filter(todo => {
    if (todo.isCompleted) return false;
    
    if (!todo.dueDate) return false;
    
    const taskDate = new Date(todo.dueDate);
    const today = new Date();
    
    // Reset time for comparison
    taskDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    return taskDate.getTime() === today.getTime();
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await getTasks();
        if (response) {
          setTodos(response);
        } else if (Array.isArray(response)) {
          setTodos(response);
        } else {
          console.warn(
            "Unexpected response structure from getTasks:",
            response
          );
        }
      } catch (e) {
        setError("Failed to fetch tasks.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
      >
        <View className="flex-1">
          <View className="px-4 py-6">
            <Text className="text-3xl font-bold text-gray-800">Today</Text>
          </View>
          <FlatList
            data={todaysIncompleteTodos}
            renderItem={({ item }) => (
              <TodoItem 
                todo={item} 
                onToggle={handleTodoToggle}
              />
            )}
            keyExtractor={(item) => item.$id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
            className="flex-1"
          />
        </View>
        <CreateTodo onTaskCreate={handleTaskCreate} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

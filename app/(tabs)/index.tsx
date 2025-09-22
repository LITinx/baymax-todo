import CreateTodo from "@/components/CreateTodo";
import { useTasksStore } from "@/services/store";
import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import TodoItem from "../../components/TodoItem";
import { getTasks, ITask } from "../../services/appwrite";

export default function Index() {
  const tasks = useTasksStore(state => state.tasks)
  const updateTasks = useTasksStore(state => state.updateTasks)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleTodoToggle = (taskId: string, isCompleted: boolean) => {
    updateTasks(
      tasks.map(todo =>
        todo.$id === taskId ? { ...todo, isCompleted } : todo
      ))
  };

  const handleTaskCreate = (newTask: ITask) => {
    updateTasks([newTask, ...tasks]);
  };

  // Separate completed and incomplete tasks
  const inboxIncompleteTasks = tasks.filter(todo => {
    if (todo.isCompleted) return false;

    if (!todo.dueDate) return true;

    const taskDate = new Date(todo.dueDate);
    const today = new Date();

    // Reset time for comparison
    taskDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return taskDate.getTime() !== today.getTime();
  });
  const completedTasks = tasks.filter(todo => todo.isCompleted);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await getTasks();
        if (response) {
          updateTasks(response);
        } else if (Array.isArray(response)) {
          updateTasks(response);
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
    <SafeAreaView className="flex-1 bg-blue-50">
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
      >

        <ScrollView className="flex-1">
          <View className="px-4 py-6">
            <Text className="text-3xl font-bold text-gray-800">Home</Text>
          </View>

          {/* Inbox Section */}
          <View className="mb-6">
            <View className="px-4 mb-4">
              <Text className="text-xl font-semibold text-gray-700">Inbox</Text>
              <Text className="text-sm text-gray-500">{inboxIncompleteTasks.length} tasks</Text>
            </View>
            {inboxIncompleteTasks.length > 0 ? (
              inboxIncompleteTasks.map((item) => (
                <TodoItem
                  key={item.$id}
                  todo={item}
                  onToggle={handleTodoToggle}
                />
              ))
            ) : (
              <View className="px-4 py-8">
                <Text className="text-gray-500 text-center">No pending tasks</Text>
              </View>
            )}
          </View>

          {/* Completed Section */}
          {completedTasks.length > 0 && (
            <Animated.View
              layout={LinearTransition.springify()} className="mb-6">
              <View className="px-4 mb-4">
                <Text className="text-xl font-semibold text-gray-700">Completed</Text>
                <Text className="text-sm text-gray-500">{completedTasks.length} tasks</Text>
              </View>
              {completedTasks.map((item) => (
                <TodoItem
                  key={item.$id}
                  todo={item}
                  onToggle={handleTodoToggle}
                />
              ))}
            </Animated.View>
          )}

        </ScrollView>
        <CreateTodo onTaskCreate={handleTaskCreate} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

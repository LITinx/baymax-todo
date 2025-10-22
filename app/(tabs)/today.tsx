import CreateTodo from "@/components/CreateTodo";
import { useTasksStore } from "@/services/store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import TodoItem from "../../components/TodoItem";
import Toast from "../../components/Toast";
import { getTasks, ITask } from "../../services/appwrite";

export default function Today() {
  const tasks = useTasksStore((state) => state.tasks);
  const updateTasks = useTasksStore((state) => state.updateTasks);
  const scheduleDelete = useTasksStore((state) => state.scheduleDelete);
  const undoDelete = useTasksStore((state) => state.undoDelete);
  const hideUndoToast = useTasksStore((state) => state.hideUndoToast);
  const undoToast = useTasksStore((state) => state.undoToast);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleTodoToggle = (taskId: string, isCompleted: boolean) => {
    updateTasks(
      tasks.map((todo) =>
        todo.$id === taskId ? { ...todo, isCompleted } : todo,
      ),
    );
  };

  const handleTaskCreate = (newTask: ITask) => {
    updateTasks([newTask, ...tasks]);
  };

  const handleTaskDelete = (taskId: string) => {
    scheduleDelete(taskId);
  };

  const handleUndoDelete = async () => {
    if (undoToast.taskId) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      undoDelete(undoToast.taskId);
    }
  };

  // Filter to show only today's incomplete tasks
  const todaysIncompleteTodos = tasks.filter((todo) => {
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
          updateTasks(response);
        } else if (Array.isArray(response)) {
          updateTasks(response);
        } else {
          console.warn(
            "Unexpected response structure from getTasks:",
            response,
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
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        {/* Header */}
        <View className="px-4 py-6">
          <Text className="text-3xl font-bold text-gray-800">Today</Text>
        </View>

        {/* Scrollable content */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
        >
          {todaysIncompleteTodos.map((item) => (
            <TodoItem
              key={item.$id}
              todo={item}
              onToggle={handleTodoToggle}
              onDelete={handleTaskDelete}
            />
          ))}
        </ScrollView>

        {/* Sticky bottom input */}
        <CreateTodo onTaskCreate={handleTaskCreate} />
        <Toast
          visible={undoToast.visible}
          message={`"${undoToast.taskTitle}" deleted`}
          actionText="Undo"
          onAction={handleUndoDelete}
          onDismiss={hideUndoToast}
          duration={4000}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

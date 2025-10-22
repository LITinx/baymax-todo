import CreateTodo from "@/components/CreateTodo";
import { useTasksStore } from "@/services/store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogOut } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import TodoItem from "../../components/TodoItem";
import Toast from "../../components/Toast";
import { getTasks, ITask } from "../../services/appwrite";
import { useAuth } from "../../contexts/AuthContext";

export default function Index() {
  const tasks = useTasksStore((state) => state.tasks);
  const updateTasks = useTasksStore((state) => state.updateTasks);
  const scheduleDelete = useTasksStore((state) => state.scheduleDelete);
  const undoDelete = useTasksStore((state) => state.undoDelete);
  const hideUndoToast = useTasksStore((state) => state.hideUndoToast);
  const undoToast = useTasksStore((state) => state.undoToast);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout, user } = useAuth();

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

  // Separate completed and incomplete tasks
  const inboxIncompleteTasks = tasks.filter((todo) => {
    if (todo.isCompleted) return false;

    if (!todo.dueDate) return true;

    const taskDate = new Date(todo.dueDate);
    const today = new Date();

    // Reset time for comparison
    taskDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return taskDate.getTime() !== today.getTime();
  });
  const completedTasks = tasks.filter((todo) => todo.isCompleted);

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

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error: any) {
            Alert.alert("Logout Error", error.message);
          }
        },
      },
    ]);
  };

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
        <ScrollView className="flex-1">
          <View className="px-4 py-6 flex-row justify-between items-center">
            <View>
              <Text className="text-3xl font-bold text-gray-800">Home</Text>
              <Text className="text-sm text-gray-600">
                Welcome, {user?.name}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              className="p-2 rounded-lg bg-red-50"
            >
              <LogOut size={24} color="#dc2626" />
            </TouchableOpacity>
          </View>

          {/* Inbox Section */}
          <View className="mb-6">
            <View className="px-4 mb-4">
              <Text className="text-xl font-semibold text-gray-700">Inbox</Text>
              <Text className="text-sm text-gray-500">
                {inboxIncompleteTasks.length} tasks
              </Text>
            </View>
            {inboxIncompleteTasks.length > 0 ? (
              inboxIncompleteTasks.map((item) => (
                <TodoItem
                  key={item.$id}
                  todo={item}
                  onToggle={handleTodoToggle}
                  onDelete={handleTaskDelete}
                />
              ))
            ) : (
              <View className="px-4 py-8">
                <Text className="text-gray-500 text-center">
                  No pending tasks
                </Text>
              </View>
            )}
          </View>

          {/* Completed Section */}
          {completedTasks.length > 0 && (
            <Animated.View
              layout={LinearTransition.springify()}
              className="mb-6"
            >
              <View className="px-4 mb-4">
                <Text className="text-xl font-semibold text-gray-700">
                  Completed
                </Text>
                <Text className="text-sm text-gray-500">
                  {completedTasks.length} tasks
                </Text>
              </View>
              {completedTasks.map((item) => (
                <TodoItem
                  key={item.$id}
                  todo={item}
                  onToggle={handleTodoToggle}
                  onDelete={handleTaskDelete}
                />
              ))}
            </Animated.View>
          )}
        </ScrollView>
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

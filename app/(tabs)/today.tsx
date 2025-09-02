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
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior="padding"
        className="p-4 flex justify-between h-full"
      >
        <View>
          <FlatList
            data={todos}
            renderItem={({ item }) => <TodoItem todo={item} />}
            keyExtractor={(item) => item.$id}
          />
        </View>
        <CreateTodo></CreateTodo>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

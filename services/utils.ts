import { createTask } from "./appwrite";

export async function handleTaskAction(payload: any) {
  try {
    switch (payload.action) {
      case "create":
        return await createTask({
          title: payload.title,
          description: payload.description,
          dueDate: payload.dueDate,
        });
      default:
        throw new Error(`Unknown action: ${(payload as any).action}`);
    }
  } catch (err) {
    console.error("Failed to handle task action:", err);
    return null;
  }
}
import { create } from "zustand";
import { ITask, deleteTask as deleteTaskFromDB } from "./appwrite";

interface PendingDeletion {
  task: ITask;
  timeoutId: ReturnType<typeof setTimeout>;
}

type State = {
  tasks: ITask[];
  aiMode: boolean;
  pendingDeletions: Map<string, PendingDeletion>;
  undoToast: {
    visible: boolean;
    taskTitle: string;
    taskId: string;
  };
};

type Action = {
  updateTasks: (tasks: State["tasks"]) => void;
  updateAiMode: (aiMode: State["aiMode"]) => void;
  deleteTask: (taskId: string) => void;
  scheduleDelete: (taskId: string) => void;
  undoDelete: (taskId: string) => void;
  hideUndoToast: () => void;
};

export const useTasksStore = create<State & Action>((set, get) => ({
  aiMode: false,
  tasks: [],
  pendingDeletions: new Map(),
  undoToast: {
    visible: false,
    taskTitle: "",
    taskId: "",
  },
  updateAiMode: (aiMode: boolean) => set(() => ({ aiMode })),
  updateTasks: (tasks) => set(() => ({ tasks })),
  deleteTask: (taskId: string) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.$id !== taskId),
    })),
  scheduleDelete: (taskId: string) => {
    const state = get();
    const task = state.tasks.find((t) => t.$id === taskId);
    if (!task) return;

    // Clear any existing timeout for this task
    const existingPending = state.pendingDeletions.get(taskId);
    if (existingPending) {
      clearTimeout(existingPending.timeoutId);
    }

    // Remove from UI immediately
    set((state) => ({
      tasks: state.tasks.filter((task) => task.$id !== taskId),
    }));

    // Show undo toast
    set(() => ({
      undoToast: {
        visible: true,
        taskTitle: task.title,
        taskId: taskId,
      },
    }));

    // Schedule actual deletion
    const timeoutId = setTimeout(async () => {
      try {
        await deleteTaskFromDB(taskId);
        set((state) => {
          const newPendingDeletions = new Map(state.pendingDeletions);
          newPendingDeletions.delete(taskId);
          return {
            pendingDeletions: newPendingDeletions,
            undoToast:
              state.undoToast.taskId === taskId
                ? { visible: false, taskTitle: "", taskId: "" }
                : state.undoToast,
          };
        });
      } catch (error) {
        console.error("Failed to delete task:", error);
        // Restore task on error
        set((state) => ({
          tasks: [...state.tasks, task],
          undoToast: { visible: false, taskTitle: "", taskId: "" },
        }));
      }
    }, 4000);

    const pendingDeletion: PendingDeletion = { task, timeoutId };

    set((state) => {
      const newPendingDeletions = new Map(state.pendingDeletions);
      newPendingDeletions.set(taskId, pendingDeletion);
      return { pendingDeletions: newPendingDeletions };
    });
  },
  undoDelete: (taskId: string) => {
    const state = get();
    const pendingDeletion = state.pendingDeletions.get(taskId);

    if (pendingDeletion) {
      clearTimeout(pendingDeletion.timeoutId);

      set((state) => {
        const newPendingDeletions = new Map(state.pendingDeletions);
        newPendingDeletions.delete(taskId);

        return {
          tasks: [...state.tasks, pendingDeletion.task].sort(
            (a, b) =>
              new Date(b.$createdAt).getTime() -
              new Date(a.$createdAt).getTime(),
          ),
          pendingDeletions: newPendingDeletions,
          undoToast: { visible: false, taskTitle: "", taskId: "" },
        };
      });
    }
  },
  hideUndoToast: () =>
    set(() => ({
      undoToast: { visible: false, taskTitle: "", taskId: "" },
    })),
}));

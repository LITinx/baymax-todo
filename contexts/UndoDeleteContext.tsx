import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { ITask, deleteTask } from "@/services/appwrite";
import Toast from "@/components/Toast";

interface PendingDeletion {
  task: ITask;
  timeoutId: NodeJS.Timeout;
  onConfirmDelete: (taskId: string) => void;
}

interface UndoDeleteContextType {
  showUndoDelete: (
    task: ITask,
    onConfirmDelete: (taskId: string) => void,
  ) => void;
}

const UndoDeleteContext = createContext<UndoDeleteContextType | undefined>(
  undefined,
);

export const useUndoDelete = () => {
  const context = useContext(UndoDeleteContext);
  if (!context) {
    throw new Error("useUndoDelete must be used within an UndoDeleteProvider");
  }
  return context;
};

export const UndoDeleteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pendingDeletion, setPendingDeletion] =
    useState<PendingDeletion | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const pendingDeletionRef = useRef<PendingDeletion | null>(null);

  const showUndoDelete = useCallback(
    (task: ITask, onConfirmDelete: (taskId: string) => void) => {
      // Clear any existing pending deletion
      if (pendingDeletionRef.current) {
        clearTimeout(pendingDeletionRef.current.timeoutId);
      }

      // Create timeout to actually delete the item
      const timeoutId = setTimeout(async () => {
        try {
          await deleteTask(task.$id);
          onConfirmDelete(task.$id);
        } catch (error) {
          console.error("Failed to delete task:", error);
          // If deletion fails, we should restore the item
          // This would require additional logic to restore to UI
        }
        setPendingDeletion(null);
        setToastVisible(false);
        pendingDeletionRef.current = null;
      }, 3000); // 3 seconds to undo

      const newPendingDeletion = {
        task,
        timeoutId,
        onConfirmDelete,
      };

      setPendingDeletion(newPendingDeletion);
      pendingDeletionRef.current = newPendingDeletion;
      setToastVisible(true);
    },
    [],
  );

  const handleUndo = useCallback(() => {
    if (pendingDeletionRef.current) {
      clearTimeout(pendingDeletionRef.current.timeoutId);

      // Restore the task (this would need to be implemented in the calling component)
      // For now, we'll just dismiss the toast
      setPendingDeletion(null);
      setToastVisible(false);
      pendingDeletionRef.current = null;
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setToastVisible(false);
  }, []);

  return (
    <UndoDeleteContext.Provider value={{ showUndoDelete }}>
      {children}
      <Toast
        visible={toastVisible}
        message={`"${pendingDeletion?.task.title}" deleted`}
        actionText="Undo"
        onAction={handleUndo}
        onDismiss={handleDismiss}
        duration={4000}
      />
    </UndoDeleteContext.Provider>
  );
};

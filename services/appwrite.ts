import { Account, Client, ID, Query, TablesDB } from "react-native-appwrite";

export const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const tableDB = new TablesDB(client);
const account = new Account(client);

export interface ITask {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $sequence: number;
  $databaseId: string;
  $tableId: string;
  $permissions: string[];
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate?: string;
  userId: string;
}
// 2. Get list of tasks for the current user
export async function getTasks(): Promise<ITask[]> {
  try {
    // Get current user to filter tasks
    const currentUser = await account.get();
    
    const response = await tableDB.listRows({
      databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
      tableId: "tasks",
      queries: [
        Query.equal("userId", currentUser.$id),
        Query.limit(100),
        Query.offset(0)
      ],
    });

    const tasks: ITask[] = response.rows.map((row) => ({
      $id: row.$id,
      $createdAt: row.$createdAt,
      $updatedAt: row.$updatedAt,
      $databaseId: row.$databaseId,
      $permissions: row.$permissions,
      $sequence: row.$sequence,
      $tableId: row.$tableId,
      title: row.title,
      description: row.description,
      isCompleted: row.isCompleted,
      dueDate: row.dueDate,
      userId: row.userId,
    }));

    return tasks;
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
    return [];
  }
}

// 3. Create a new task for the current user
export async function createTask(params: {
  title: string;
  description?: string;
  dueDate?: string;
}): Promise<ITask | null> {
  try {
    // Get current user to associate task with them
    const currentUser = await account.get();
    
    const response = await tableDB.createRow({
      databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
      tableId: "tasks",
      rowId: ID.unique(),
      data: {
        title: params.title,
        description: params.description || "",
        isCompleted: false,
        dueDate: params.dueDate || null,
        userId: currentUser.$id,
      },
    });

    return {
      $id: response.$id,
      $createdAt: response.$createdAt,
      $updatedAt: response.$updatedAt,
      $databaseId: response.$databaseId,
      $permissions: response.$permissions,
      $sequence: response.$sequence,
      $tableId: response.$tableId,
      title: response.title,
      description: response.description,
      isCompleted: response.isCompleted,
      dueDate: response.dueDate,
      userId: response.userId,
    };
  } catch (err) {
    console.error("Failed to create task:", err);
    return null;
  }
}

// 4. Update task completion status
export async function updateTask(
  taskId: string,
  isCompleted: boolean,
): Promise<boolean> {
  try {
    await tableDB.updateRow({
      databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
      tableId: "tasks",
      rowId: taskId,
      data: { isCompleted },
    });
    return true;
  } catch (err) {
    console.error("Failed to update task:", err);
    return false;
  }
}

// 5. Delete task
export async function deleteTask(taskId: string): Promise<boolean> {
  try {
    await tableDB.deleteRow({
      databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
      tableId: "tasks",
      rowId: taskId,
    });
    return true;
  } catch (err) {
    console.error("Failed to delete task:", err);
    return false;
  }
}

import { Account, Client, TablesDB } from "react-native-appwrite";

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const tableDB = new TablesDB(client);
const account = new Account(client);

export const login = async () => {
  try {
    await account.get();
  } catch (e) {
    // Not logged in
    await account.createEmailPasswordSession(
      "daniel@baymax.com",
      "12341234test"
    );
  }
};

export interface ITask {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $sequence: number
  $databaseId: string
  $tableId: string
  $permissions: string[];
  title: string;
  description: string;
  isCompleted: boolean;
}
// 2. Get list of tasks
export async function getTasks(): Promise<ITask[]> {
  try {
    const response = await tableDB.listRows(
      process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
      "tasks"
    );

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
    }));

    return tasks;
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
    return [];
  }
}

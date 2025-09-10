import { create } from 'zustand'
import { ITask } from './appwrite'

type State = {
  tasks: ITask[]
}

type Action = {
  updateTasks: (tasks: State['tasks']) => void
}

// Create your store, which includes both state and (optionally) actions
export const useTasksStore = create<State & Action>((set) => ({
  tasks: [],
  updateTasks: (tasks) => set(() => ({tasks})),
}))
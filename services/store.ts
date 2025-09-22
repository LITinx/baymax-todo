import { create } from 'zustand'
import { ITask } from './appwrite'

type State = {
  tasks: ITask[]
  aiMode: boolean
}

type Action = {
  updateTasks: (tasks: State['tasks']) => void
  updateAiMode: (aiMode: State['aiMode']) => void
}

export const useTasksStore = create<State & Action>((set) => ({
  aiMode: false,
  tasks: [],
  updateAiMode: (aiMode: boolean) => set(() => ({aiMode})),
  updateTasks: (tasks) => set(() => ({tasks})),
}))


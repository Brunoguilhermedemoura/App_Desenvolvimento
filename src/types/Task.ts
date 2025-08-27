export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  priority: TaskPriority;
  completedAt?: string | null;
}

export type TaskPriority = 'baixa' | 'média' | 'alta';

export interface CreateTaskData {
  title: string;
  description: string;
  priority: TaskPriority;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  completed?: boolean;
  completedAt?: string | null;
}

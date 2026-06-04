export interface Task {
  id: number;

  title: string;

  description: string;

  priority: string;

  status: string;

  createdAt?: string;

  dueDate?: string | null;

  project?: {
    id: number;
    name: string;
  } | null;

  assignee?: {
    id: number;
    name: string;
    email: string;
  } | null;
}

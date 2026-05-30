export interface DashboardData {
  totalTasks: number;

  completedTasks: number;

  inProgressTasks: number;

  totalProjects: number;

  totalUsers: number;

  productivity: number;

  tasksByPriority: {
    priority: string;

    count: number;
  }[];

  tasksByStatus: {
    status: string;

    count: number;
  }[];
}

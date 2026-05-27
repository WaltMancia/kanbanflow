export interface DashboardStats {
  totalProjects: number;

  totalTeams: number;

  totalTasks: number;

  completedTasks: number;

  productivity: number;

  tasksPerStatus: {
    status: string;
    count: number;
  }[];

  priorities: {
    priority: string;
    count: number;
  }[];
}

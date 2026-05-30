export interface SearchResponse {
  projects: {
    id: number;
    name: string;
  }[];

  tasks: {
    id: number;
    title: string;
  }[];

  users: {
    id: number;
    fullName: string;
  }[];

  teams: {
    id: number;
    name: string;
  }[];
}

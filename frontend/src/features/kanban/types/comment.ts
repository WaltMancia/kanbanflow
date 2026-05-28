export interface Comment {
  id: number;

  content: string;

  createdAt: string;

  user: {
    id: number;
    name: string;
    email: string;
  };
}

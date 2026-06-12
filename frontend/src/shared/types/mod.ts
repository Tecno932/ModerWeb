export interface Mod {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  description: string;
  content?: any;

  icon?: string;

  platform: string;
  type: string;
  loader?: string;

  createdAt: string;

  categories: string[];

  tags: {
    id: number;
    name: string;
  }[];

  stats: {
    views: number;
    downloads: number;
    likes: number;
    favorites: number;
  };

  author?: {
    id: number;
    username: string;
  };
}
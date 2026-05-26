export interface ModSearchDto {
  page?: number;

  limit?: number;

  query?: string;

  platform?: string;

  loader?: string;

  sort?: "newest" | "popular";
}
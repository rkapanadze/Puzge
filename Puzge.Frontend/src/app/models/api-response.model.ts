export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: {
    en: string;
    ka: string;
  };
  total?: number;
  page?: number;
  limit?: number;
}

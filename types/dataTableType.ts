export interface DataTableType {
  page: number;
  limit: number;
  sortBy?: string;
  [key: string]: unknown;
}
export interface DataResult<T = Record<string, unknown>> {
  items: T[];
  meta: {
    total_items: number;
  };
}

import { api } from "./api";
import type { NewsResponse } from "../types/news";

export const getNews = async (
  page: number = 1,
  keyword: string = "",
  limit: number = 6,
): Promise<NewsResponse> => {
  const params: Record<string, unknown> = { page, limit };
  if (keyword) params.keyword = keyword;
  const { data } = await api.get<NewsResponse>("/news", { params });
  return data;
};

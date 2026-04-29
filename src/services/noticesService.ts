import { api } from "./api";
import type { NoticesResponse, NoticeDetail } from "../types/notices";

export interface NoticesParams {
  keyword?: string;
  category?: string;
  species?: string;
  sex?: string;
  locationId?: string;
  byDate?: boolean;
  byPrice?: boolean;
  byPopularity?: boolean;
  page?: number;
  limit?: number;
}

export const getNotices = async (
  params: NoticesParams,
): Promise<NoticesResponse> => {
  const { data } = await api.get<NoticesResponse>("/notices", { params });
  return data;
};

export const getNoticeById = async (id: string): Promise<NoticeDetail> => {
  const { data } = await api.get<NoticeDetail>(`/notices/${id}`);
  return data;
};

export const getCategories = async (): Promise<string[]> => {
  const { data } = await api.get<string[]>("/notices/categories");
  return data;
};

export const getSexOptions = async (): Promise<string[]> => {
  const { data } = await api.get<string[]>("/notices/sex");
  return data;
};

export const getSpecies = async (): Promise<string[]> => {
  const { data } = await api.get<string[]>("/notices/species");
  return data;
};

export const addToFavorites = async (id: string): Promise<void> => {
  await api.post(`/notices/favorites/add/${id}`);
};

export const removeFromFavorites = async (id: string): Promise<void> => {
  await api.delete(`/notices/favorites/remove/${id}`);
};

export const searchCities = async (keyword: string) => {
  const { data } = await api.get("/cities", { params: { keyword } });
  return data;
};

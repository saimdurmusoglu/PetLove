import { api } from "./api";
import type { Friend } from "../types/friends";

export const fetchFriends = async (): Promise<Friend[]> => {
  const response = await api.get<Friend[]>("/friends");
  return response.data;
};

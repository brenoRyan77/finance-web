import { apiClient } from "@/services/apiClient.ts";

import { Category } from "@/types";

export const fetchCategories = async (): Promise<Category[]> => {
    return apiClient.get<Category[]>('/categories');
};
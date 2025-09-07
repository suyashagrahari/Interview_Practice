import { useState, useEffect, useCallback } from 'react';
import { strapiApi, Category } from '@/lib/api/strapi';

export interface CategoryOption {
  id: string;
  name: string;
  color: string;
}

interface UseCategoriesReturn {
  categories: CategoryOption[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Color mapping for different categories
const getCategoryColor = (slug: string): string => {
  const colorMap: { [key: string]: string } = {
    frontend: "bg-blue-500",
    backend: "bg-green-500",
    database: "bg-purple-500",
    cloud: "bg-indigo-500",
    mobile: "bg-pink-500",
    devops: "bg-orange-500",
    ai: "bg-cyan-500",
    security: "bg-red-500",
    default: "bg-gray-500",
  };
  return colorMap[slug] || colorMap.default;
};

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await strapiApi.getCategories();
      
      // Map API data to component format
      const mappedCategories: CategoryOption[] = [
        { id: "all", name: "All Topics", color: "bg-gray-500" },
        ...response.data.map((category: Category) => ({
          id: category.slug,
          name: category.name,
          color: getCategoryColor(category.slug),
        })),
      ];
      
      setCategories(mappedCategories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
      
      // Fallback to default categories if API fails
      setCategories([
        { id: "all", name: "All Topics", color: "bg-gray-500" },
        { id: "frontend", name: "Frontend", color: "bg-blue-500" },
        { id: "backend", name: "Backend", color: "bg-green-500" },
        { id: "database", name: "Database", color: "bg-purple-500" },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
};

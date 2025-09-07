import { useState, useEffect, useCallback, useRef } from 'react';
import { strapiApi, Technology, Category } from '@/lib/api/strapi';

export interface TechnologyOption {
  id: string;
  name: string;
  title: string;
  description: string;
  slug: string;
  difficultyLevel: string;
  popularity: string;
  color: string;
  bgColor: string;
  icon: string;
}

interface UseTechnologiesParams {
  category?: string;
  page?: number;
  pageSize?: number;
}

interface UseTechnologiesReturn {
  technologies: TechnologyOption[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

// Attractive color combinations for technology cards
const getRandomColorScheme = (index: number) => {
  const colorSchemes = [
    { color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/20", icon: "💙" },
    { color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/20", icon: "💚" },
    { color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/20", icon: "💜" },
    { color: "text-pink-600", bgColor: "bg-pink-100 dark:bg-pink-900/20", icon: "💗" },
    { color: "text-indigo-600", bgColor: "bg-indigo-100 dark:bg-indigo-900/20", icon: "💙" },
    { color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/20", icon: "🧡" },
    { color: "text-teal-600", bgColor: "bg-teal-100 dark:bg-teal-900/20", icon: "💚" },
    { color: "text-cyan-600", bgColor: "bg-cyan-100 dark:bg-cyan-900/20", icon: "💙" },
    { color: "text-rose-600", bgColor: "bg-rose-100 dark:bg-rose-900/20", icon: "💗" },
    { color: "text-amber-600", bgColor: "bg-amber-100 dark:bg-amber-900/20", icon: "💛" },
    { color: "text-emerald-600", bgColor: "bg-emerald-100 dark:bg-emerald-900/20", icon: "💚" },
    { color: "text-violet-600", bgColor: "bg-violet-100 dark:bg-violet-900/20", icon: "💜" },
  ];
  
  return colorSchemes[index % colorSchemes.length];
};

export const useTechnologies = (params: UseTechnologiesParams = {}): UseTechnologiesReturn => {
  const [technologies, setTechnologies] = useState<TechnologyOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);

  const fetchTechnologies = useCallback(async (page: number = 1, append: boolean = false) => {
    // Prevent multiple simultaneous calls
    if (isFetchingRef.current) {
      return;
    }
    
    try {
      isFetchingRef.current = true;
      if (page === 1) {
        setIsLoading(true);
      }
      setError(null);
      
      let response;
      
      if (params.category && params.category !== 'all') {
        // Fetch technologies by category
        const categoryResponse = await strapiApi.getTechnologiesByCategory(params.category, {
          page,
          pageSize: params.pageSize || 25,
        });
        
        // Extract technologies from the category response
        const categoryData = categoryResponse.data[0];
        if (categoryData && categoryData.technologies) {
          const mappedTechnologies: TechnologyOption[] = categoryData.technologies.map((tech: Technology, index: number) => {
            const colorScheme = getRandomColorScheme(index);
            return {
              id: tech.slug,
              name: tech.name,
              title: tech.title,
              description: tech.description,
              slug: tech.slug,
              difficultyLevel: tech.difficultyLevel || 'Beginner',
              popularity: tech.popularity || '0',
              color: colorScheme.color,
              bgColor: colorScheme.bgColor,
              icon: colorScheme.icon,
            };
          });
          
          response = {
            data: mappedTechnologies,
            meta: {
              pagination: {
                page: 1,
                pageSize: mappedTechnologies.length,
                pageCount: 1,
                total: mappedTechnologies.length,
              },
            },
          };
        } else {
          response = {
            data: [],
            meta: {
              pagination: {
                page: 1,
                pageSize: 0,
                pageCount: 0,
                total: 0,
              },
            },
          };
        }
      } else {
        // Fetch all technologies
        response = await strapiApi.getTechnologies({
          page,
          pageSize: params.pageSize || 25,
        });
        
        const mappedTechnologies: TechnologyOption[] = response.data.map((tech: Technology, index: number) => {
          const colorScheme = getRandomColorScheme(index);
          return {
            id: tech.slug,
            name: tech.name,
            title: tech.title,
            description: tech.description,
            slug: tech.slug,
            difficultyLevel: tech.difficultyLevel || 'Beginner',
            popularity: tech.popularity || '0',
            color: colorScheme.color,
            bgColor: colorScheme.bgColor,
            icon: colorScheme.icon,
          };
        });
        
        response = {
          ...response,
          data: mappedTechnologies,
        };
      }
      
      if (append) {
        setTechnologies(prev => [...prev, ...response.data]);
      } else {
        setTechnologies(response.data);
      }
      
      setCurrentPage(response.meta.pagination.page);
      setTotalPages(response.meta.pagination.pageCount);
      setTotalCount(response.meta.pagination.total);
      setHasMore(response.meta.pagination.page < response.meta.pagination.pageCount);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch technologies';
      setError(errorMessage);
      console.error('Error fetching technologies:', err);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [params.category, params.pageSize]);

  const loadMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      await fetchTechnologies(currentPage + 1, true);
    }
  }, [fetchTechnologies, currentPage, hasMore, isLoading]);

  // Reset and fetch when category changes
  useEffect(() => {
    setTechnologies([]);
    setCurrentPage(1);
    setTotalPages(1);
    setTotalCount(0);
    setHasMore(true);
    fetchTechnologies(1, false);
  }, [params.category, fetchTechnologies]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isFetchingRef.current = false;
    };
  }, []);

  return {
    technologies,
    isLoading,
    error,
    refetch: () => fetchTechnologies(1, false),
    hasMore,
    loadMore,
    currentPage,
    totalPages,
    totalCount,
  };
};

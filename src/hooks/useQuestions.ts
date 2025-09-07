import { useState, useEffect, useCallback, useRef } from 'react';
import { strapiApi, Question } from '@/lib/api/strapi';

interface UseQuestionsParams {
  technology?: string;
  level?: string;
  category?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

interface UseQuestionsReturn {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export const useQuestions = (params: UseQuestionsParams = {}): UseQuestionsReturn => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);

  const fetchQuestions = useCallback(async (page: number = 1, append: boolean = false) => {
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
      
      const response = await strapiApi.getQuestions({
        ...params,
        page,
        pageSize: params.pageSize || 25,
        sort: params.sort || 'order:asc',
      });
      
      if (append) {
        setQuestions(prev => [...prev, ...response.data]);
      } else {
        setQuestions(response.data);
      }
      
      setCurrentPage(response.meta.pagination.page);
      setTotalPages(response.meta.pagination.pageCount);
      setTotalCount(response.meta.pagination.total);
      setHasMore(response.meta.pagination.page < response.meta.pagination.pageCount);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch questions';
      setError(errorMessage);
      console.error('Error fetching questions:', err);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [params.technology, params.level, params.category, params.pageSize, params.sort]);

  const loadMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      await fetchQuestions(currentPage + 1, true);
    }
  }, [fetchQuestions, currentPage, hasMore, isLoading]);

  // Reset and fetch when params change
  useEffect(() => {
    setQuestions([]);
    setCurrentPage(1);
    setTotalPages(1);
    setTotalCount(0);
    setHasMore(true);
    fetchQuestions(1, false);
  }, [params.technology, params.level, params.category, fetchQuestions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isFetchingRef.current = false;
    };
  }, []);

  return {
    questions,
    isLoading,
    error,
    refetch: () => fetchQuestions(1, false),
    hasMore,
    loadMore,
    currentPage,
    totalPages,
    totalCount,
  };
};

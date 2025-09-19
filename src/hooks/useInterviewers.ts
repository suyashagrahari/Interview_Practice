import { useQuery } from '@tanstack/react-query';
import { InterviewerApiService } from '@/lib/api';

// Query keys for React Query
export const interviewerKeys = {
  all: ['interviewers'] as const,
  lists: () => [...interviewerKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...interviewerKeys.lists(), { filters }] as const,
  details: () => [...interviewerKeys.all, 'detail'] as const,
  detail: (id: string) => [...interviewerKeys.details(), id] as const,
};

// Hook to get all interviewers
export const useInterviewers = () => {
  return useQuery({
    queryKey: interviewerKeys.lists(),
    queryFn: async () => {
      const response = await InterviewerApiService.getAllInterviewers();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook to get interviewer by ID
export const useInterviewer = (id: string) => {
  return useQuery({
    queryKey: interviewerKeys.detail(id),
    queryFn: async () => {
      const response = await InterviewerApiService.getInterviewerById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};



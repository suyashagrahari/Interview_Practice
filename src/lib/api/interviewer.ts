import { apiClient } from './index';

export interface Interviewer {
  _id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  specialties: string[];
  experience: string;
  bio: string;
  introduction: string;
  numberOfInterviewers: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewersResponse {
  success: boolean;
  message: string;
  data: Interviewer[];
  count: number;
}

export interface InterviewerResponse {
  success: boolean;
  message: string;
  data: Interviewer;
}

export const InterviewerApiService = {
  // Get all active interviewers
  getAllInterviewers: async (): Promise<InterviewersResponse> => {
    try {
      const response = await apiClient.get('/interviewers');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching interviewers:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch interviewers');
    }
  },

  // Get interviewer by ID
  getInterviewerById: async (id: string): Promise<InterviewerResponse> => {
    try {
      const response = await apiClient.get(`/interviewers/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching interviewer:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch interviewer');
    }
  },

  // Create new interviewer (admin only)
  createInterviewer: async (interviewerData: Partial<Interviewer>): Promise<InterviewerResponse> => {
    try {
      const response = await apiClient.post('/interviewers', interviewerData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating interviewer:', error);
      throw new Error(error.response?.data?.message || 'Failed to create interviewer');
    }
  },

  // Update interviewer (admin only)
  updateInterviewer: async (id: string, interviewerData: Partial<Interviewer>): Promise<InterviewerResponse> => {
    try {
      const response = await apiClient.put(`/interviewers/${id}`, interviewerData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating interviewer:', error);
      throw new Error(error.response?.data?.message || 'Failed to update interviewer');
    }
  },

  // Delete interviewer (admin only)
  deleteInterviewer: async (id: string): Promise<InterviewerResponse> => {
    try {
      const response = await apiClient.delete(`/interviewers/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting interviewer:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete interviewer');
    }
  }
};



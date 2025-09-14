// Local storage utility functions for user data management

export interface StoredUserData {
  // Basic user info
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  provider: 'email' | 'google';
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Profile data
  profile: {
    jobTitle: string;
    phone: string;
    website: string;
    linkedin: string;
    country: string;
    state: string;
    city: string;
    showStateOnResume: boolean;
    showCountryOnResume: boolean;
    showCityOnResume: boolean;
    summary: string;
    experiences: Array<{
      id: string;
      role: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      description: string;
      isCurrent: boolean;
    }>;
    projects: Array<{
      id: string;
      title: string;
      organization: string;
      startDate: string;
      endDate: string;
      url: string;
      description: string;
    }>;
    educations: Array<{
      id: string;
      degree: string;
      institution: string;
      location: string;
      graduationDate: string;
      minor?: string;
      gpa?: string;
      additionalInfo?: string;
    }>;
    skills: Array<{
      id: string;
      name: string;
    }>;
  };
  
  // Cache metadata
  lastUpdated: string;
}

const USER_STORAGE_KEY = 'interview_user_data';

// Check if we're in a browser environment
const isClient = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

// Unified user data storage (includes profile data)
export const userStorage = {
  set: (userData: StoredUserData) => {
    if (!isClient) return;
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data to localStorage:', error);
    }
  },

  get: (): StoredUserData | null => {
    if (!isClient) return null;
    try {
      const data = localStorage.getItem(USER_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading user data from localStorage:', error);
      return null;
    }
  },

  remove: () => {
    if (!isClient) return;
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Error removing user data from localStorage:', error);
    }
  },

  // Update specific section of profile data
  updateProfileSection: (section: keyof StoredUserData['profile'], data: any) => {
    if (!isClient) return;
    try {
      const currentData = userStorage.get();
      if (currentData) {
        const updatedData = {
          ...currentData,
          profile: {
            ...currentData.profile,
            [section]: data
          },
          lastUpdated: new Date().toISOString()
        };
        userStorage.set(updatedData);
      }
    } catch (error) {
      console.error('Error updating profile section in localStorage:', error);
    }
  },

  // Update basic user info
  updateUserInfo: (userInfo: Partial<Omit<StoredUserData, 'profile' | 'lastUpdated'>>) => {
    if (!isClient) return;
    try {
      const currentData = userStorage.get();
      if (currentData) {
        const updatedData = {
          ...currentData,
          ...userInfo,
          lastUpdated: new Date().toISOString()
        };
        userStorage.set(updatedData);
      }
    } catch (error) {
      console.error('Error updating user info in localStorage:', error);
    }
  },

  // Check if user data exists and is recent (within 24 hours)
  isRecent: (): boolean => {
    if (!isClient) return false;
    try {
      const data = userStorage.get();
      if (!data || !data.lastUpdated) return false;
      
      const lastUpdated = new Date(data.lastUpdated);
      const now = new Date();
      const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
      
      return hoursDiff < 24; // Consider data recent if less than 24 hours old
    } catch (error) {
      console.error('Error checking user data recency:', error);
      return false;
    }
  },

  // Deduplicate arrays in profile data
  deduplicateProfileData: (userData: StoredUserData): StoredUserData => {
    if (!isClient) return userData;
    try {
      const deduplicatedData = {
        ...userData,
        profile: {
          ...userData.profile,
          experiences: userData.profile.experiences.filter((exp, index, self) => 
            index === self.findIndex(e => e.id === exp.id)
          ),
          projects: userData.profile.projects.filter((proj, index, self) => 
            index === self.findIndex(p => p.id === proj.id)
          ),
          educations: userData.profile.educations.filter((edu, index, self) => 
            index === self.findIndex(e => e.id === edu.id)
          ),
          skills: userData.profile.skills.filter((skill, index, self) => 
            index === self.findIndex(s => s.id === skill.id)
          )
        }
      };
      
      // Save the deduplicated data back to localStorage
      userStorage.set(deduplicatedData);
      console.log('✅ Deduplicated profile data in localStorage');
      
      return deduplicatedData;
    } catch (error) {
      console.error('Error deduplicating profile data:', error);
      return userData;
    }
  }
};

// Clear all stored data (useful for logout)
export const clearAllStorage = () => {
  if (!isClient) return;
  try {
    userStorage.remove();
    console.log('✅ All user data cleared from localStorage on logout');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Initialize complete user data from API response (when user logs in)
export const initializeUserData = (userData: any): StoredUserData => {
  const defaultProfile = {
    jobTitle: '',
    phone: '',
    website: '',
    linkedin: '',
    country: 'India',
    state: 'Rajasthan',
    city: 'Jaipur',
    showStateOnResume: false,
    showCountryOnResume: true,
    showCityOnResume: false,
    summary: '',
    experiences: [],
    projects: [],
    educations: [],
    skills: []
  };

  return {
    id: userData?.id || '',
    email: userData?.email || '',
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    avatar: userData?.avatar || '',
    provider: userData?.provider || 'email',
    isEmailVerified: userData?.isEmailVerified || false,
    createdAt: userData?.createdAt || new Date().toISOString(),
    updatedAt: userData?.updatedAt || new Date().toISOString(),
    profile: userData?.profile ? {
      ...defaultProfile,
      ...userData.profile
    } : defaultProfile,
    lastUpdated: new Date().toISOString()
  };
};

// Legacy compatibility - for backward compatibility with existing code
export const profileStorage = {
  get: () => {
    if (!isClient) return null;
    const userData = userStorage.get();
    if (!userData) return null;
    
    return {
      contactInfo: {
        fullName: `${userData.firstName} ${userData.lastName}`.trim(),
        email: userData.email,
        phone: userData.profile.phone,
        website: userData.profile.website,
        linkedin: userData.profile.linkedin,
        country: userData.profile.country,
        state: userData.profile.state,
        city: userData.profile.city,
        showStateOnResume: userData.profile.showStateOnResume,
        showCountryOnResume: userData.profile.showCountryOnResume,
        showCityOnResume: userData.profile.showCityOnResume,
        jobTitle: userData.profile.jobTitle,
        avatar: userData.avatar,
      },
      experiences: userData.profile.experiences,
      projects: userData.profile.projects,
      educations: userData.profile.educations,
      skills: userData.profile.skills,
      summary: userData.profile.summary,
      lastUpdated: userData.lastUpdated
    };
  },
  
  isRecent: () => userStorage.isRecent(),
  
  updateSection: (section: string, data: any) => {
    userStorage.updateProfileSection(section as keyof StoredUserData['profile'], data);
  }
};

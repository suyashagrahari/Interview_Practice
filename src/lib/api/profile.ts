import { AuthApiService, User } from './auth';
import { userStorage } from '../localStorage';

// Profile-specific types
export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  country: string;
  state: string;
  city: string;
  showStateOnResume: boolean;
  showCountryOnResume: boolean;
  showCityOnResume: boolean;
  jobTitle: string;
  avatar?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrent: boolean;
}

export interface Project {
  id: string;
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  url: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  minor?: string;
  gpa?: string;
  additionalInfo?: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface ProfileData {
  jobTitle?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  country?: string;
  state?: string;
  city?: string;
  showStateOnResume?: boolean;
  showCountryOnResume?: boolean;
  showCityOnResume?: boolean;
  summary?: string;
  experiences?: Experience[];
  projects?: Project[];
  educations?: Education[];
  skills?: Skill[];
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

export interface ProfileResponse {
  success: boolean;
  data: User;
  message: string;
}

// Profile API Service
export class ProfileApiService {
  // Get current user profile
  static async getProfile(): Promise<{ success: boolean; data: User }> {
    return AuthApiService.getProfile();
  }

  // Update contact information
  static async updateContactInfo(contactInfo: Partial<ContactInfo>): Promise<ProfileResponse> {
    const profileData: ProfileData = {
      jobTitle: contactInfo.jobTitle,
      phone: contactInfo.phone,
      website: contactInfo.website,
      linkedin: contactInfo.linkedin,
      country: contactInfo.country,
      state: contactInfo.state,
      city: contactInfo.city,
      showStateOnResume: contactInfo.showStateOnResume,
      showCountryOnResume: contactInfo.showCountryOnResume,
      showCityOnResume: contactInfo.showCityOnResume,
      firstName: contactInfo.fullName?.split(' ')[0],
      lastName: contactInfo.fullName?.split(' ').slice(1).join(' '),
      email: contactInfo.email,
      avatar: contactInfo.avatar,
    };

    const response = await AuthApiService.updateProfile(profileData);
    
    // Update localStorage
    if (response.success) {
      userStorage.updateProfileSection('jobTitle', contactInfo.jobTitle);
      userStorage.updateProfileSection('phone', contactInfo.phone);
      userStorage.updateProfileSection('website', contactInfo.website);
      userStorage.updateProfileSection('linkedin', contactInfo.linkedin);
      userStorage.updateProfileSection('country', contactInfo.country);
      userStorage.updateProfileSection('state', contactInfo.state);
      userStorage.updateProfileSection('city', contactInfo.city);
      userStorage.updateProfileSection('showStateOnResume', contactInfo.showStateOnResume);
      userStorage.updateProfileSection('showCountryOnResume', contactInfo.showCountryOnResume);
      userStorage.updateProfileSection('showCityOnResume', contactInfo.showCityOnResume);
      userStorage.updateUserInfo({
        firstName: contactInfo.fullName?.split(' ')[0],
        lastName: contactInfo.fullName?.split(' ').slice(1).join(' '),
        email: contactInfo.email,
        avatar: contactInfo.avatar,
      });
    }
    
    return response;
  }

  // Update experiences
  static async updateExperiences(experiences: Experience[]): Promise<ProfileResponse> {
    const response = await AuthApiService.updateProfile({ experiences });
    
    // Update localStorage
    if (response.success) {
      userStorage.updateProfileSection('experiences', experiences);
    }
    
    return response;
  }

  // Update projects
  static async updateProjects(projects: Project[]): Promise<ProfileResponse> {
    const response = await AuthApiService.updateProfile({ projects });
    
    // Update localStorage
    if (response.success) {
      userStorage.updateProfileSection('projects', projects);
    }
    
    return response;
  }

  // Update educations
  static async updateEducations(educations: Education[]): Promise<ProfileResponse> {
    const response = await AuthApiService.updateProfile({ educations });
    
    // Update localStorage
    if (response.success) {
      userStorage.updateProfileSection('educations', educations);
    }
    
    return response;
  }

  // Update skills
  static async updateSkills(skills: Skill[]): Promise<ProfileResponse> {
    const response = await AuthApiService.updateProfile({ skills });
    
    // Update localStorage
    if (response.success) {
      userStorage.updateProfileSection('skills', skills);
    }
    
    return response;
  }

  // Update summary
  static async updateSummary(summary: string): Promise<ProfileResponse> {
    const response = await AuthApiService.updateProfile({ summary });
    
    // Update localStorage
    if (response.success) {
      userStorage.updateProfileSection('summary', summary);
    }
    
    return response;
  }

  // Update entire profile
  static async updateProfile(profileData: ProfileData): Promise<ProfileResponse> {
    return AuthApiService.updateProfile(profileData);
  }
}

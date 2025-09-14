import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export interface ProfileState {
  activeTab: 'contact' | 'experience' | 'project' | 'education' | 'skills' | 'summary';
  contactInfo: ContactInfo;
  experiences: Experience[];
  projects: Project[];
  educations: Education[];
  skills: Skill[];
  summary: string;
  selectedExperienceId: string | null;
  selectedProjectId: string | null;
  selectedEducationId: string | null;
  isEditing: boolean;
}

const initialState: ProfileState = {
  activeTab: 'contact',
  contactInfo: {
    fullName: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    country: 'India',
    state: 'Rajasthan',
    city: 'Jaipur',
    showStateOnResume: false,
    showCountryOnResume: true,
    showCityOnResume: false,
    jobTitle: '',
    avatar: '',
  },
  experiences: [],
  projects: [],
  educations: [],
  skills: [],
  summary: '',
  selectedExperienceId: null,
  selectedProjectId: null,
  selectedEducationId: null,
  isEditing: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<ProfileState['activeTab']>) => {
      state.activeTab = action.payload;
    },
    updateContactInfo: (state, action: PayloadAction<Partial<ContactInfo>>) => {
      state.contactInfo = { ...state.contactInfo, ...action.payload };
    },
    addExperience: (state, action: PayloadAction<Experience>) => {
      state.experiences.push(action.payload);
    },
    updateExperience: (state, action: PayloadAction<{ id: string; updates: Partial<Experience> }>) => {
      const index = state.experiences.findIndex(exp => exp.id === action.payload.id);
      if (index !== -1) {
        state.experiences[index] = { ...state.experiences[index], ...action.payload.updates };
      }
    },
    deleteExperience: (state, action: PayloadAction<string>) => {
      state.experiences = state.experiences.filter(exp => exp.id !== action.payload);
      if (state.selectedExperienceId === action.payload) {
        state.selectedExperienceId = null;
      }
    },
    setSelectedExperience: (state, action: PayloadAction<string | null>) => {
      state.selectedExperienceId = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<{ id: string; updates: Partial<Project> }>) => {
      const index = state.projects.findIndex(proj => proj.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...action.payload.updates };
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(proj => proj.id !== action.payload);
      if (state.selectedProjectId === action.payload) {
        state.selectedProjectId = null;
      }
    },
    setSelectedProject: (state, action: PayloadAction<string | null>) => {
      state.selectedProjectId = action.payload;
    },
    addEducation: (state, action: PayloadAction<Education>) => {
      state.educations.push(action.payload);
    },
    updateEducation: (state, action: PayloadAction<{ id: string; updates: Partial<Education> }>) => {
      const index = state.educations.findIndex(edu => edu.id === action.payload.id);
      if (index !== -1) {
        state.educations[index] = { ...state.educations[index], ...action.payload.updates };
      }
    },
    deleteEducation: (state, action: PayloadAction<string>) => {
      state.educations = state.educations.filter(edu => edu.id !== action.payload);
      if (state.selectedEducationId === action.payload) {
        state.selectedEducationId = null;
      }
    },
    setSelectedEducation: (state, action: PayloadAction<string | null>) => {
      state.selectedEducationId = action.payload;
    },
    addSkill: (state, action: PayloadAction<Skill>) => {
      state.skills.push(action.payload);
    },
    updateSkill: (state, action: PayloadAction<{ id: string; updates: Partial<Skill> }>) => {
      const index = state.skills.findIndex(skill => skill.id === action.payload.id);
      if (index !== -1) {
        state.skills[index] = { ...state.skills[index], ...action.payload.updates };
      }
    },
    deleteSkill: (state, action: PayloadAction<string>) => {
      state.skills = state.skills.filter(skill => skill.id !== action.payload);
    },
    updateSummary: (state, action: PayloadAction<string>) => {
      state.summary = action.payload;
    },
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setExperiences: (state, action: PayloadAction<Experience[]>) => {
      state.experiences = action.payload;
    },
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    setEducations: (state, action: PayloadAction<Education[]>) => {
      state.educations = action.payload;
    },
    setSkills: (state, action: PayloadAction<Skill[]>) => {
      state.skills = action.payload;
    },
    clearProfileData: (state) => {
      state.experiences = [];
      state.projects = [];
      state.educations = [];
      state.skills = [];
      state.summary = '';
      state.selectedExperienceId = null;
      state.selectedProjectId = null;
      state.selectedEducationId = null;
    },
    resetProfile: () => initialState,
  },
});

export const {
  setActiveTab,
  updateContactInfo,
  addExperience,
  updateExperience,
  deleteExperience,
  setSelectedExperience,
  addProject,
  updateProject,
  deleteProject,
  setSelectedProject,
  addEducation,
  updateEducation,
  deleteEducation,
  setSelectedEducation,
  addSkill,
  updateSkill,
  deleteSkill,
  updateSummary,
  setIsEditing,
  setExperiences,
  setProjects,
  setEducations,
  setSkills,
  clearProfileData,
  resetProfile,
} = profileSlice.actions;

export default profileSlice.reducer;

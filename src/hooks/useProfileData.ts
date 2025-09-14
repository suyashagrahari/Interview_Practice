import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  updateContactInfo, 
  setExperiences,
  setProjects,
  setEducations,
  setSkills,
  updateSummary,
  clearProfileData
} from '@/store/slices/profileSlice';
import { userStorage, StoredUserData } from '@/lib/localStorage';

// Hook to load profile data from localStorage into Redux store
export const useProfileData = () => {
  const dispatch = useAppDispatch();
  const hasLoadedRef = useRef(false);
  const experiences = useAppSelector(state => state.profile.experiences);
  const projects = useAppSelector(state => state.profile.projects);
  const educations = useAppSelector(state => state.profile.educations);
  const skills = useAppSelector(state => state.profile.skills);

  useEffect(() => {
    const loadProfileData = () => {
      // Prevent multiple loads if data is already loaded
      if (hasLoadedRef.current || (experiences.length > 0 || projects.length > 0 || educations.length > 0 || skills.length > 0)) {
        console.log('📋 Profile data already loaded, skipping...');
        return;
      }

      try {
        const storedData = userStorage.get();
        if (storedData && storedData.profile) {
          console.log('🔄 Loading profile data from localStorage...');
          hasLoadedRef.current = true;
          
          // Clear existing data first
          dispatch(clearProfileData());
          
          // Deduplicate data before loading
          const deduplicatedData = userStorage.deduplicateProfileData(storedData);
          
          // Load contact information
          dispatch(updateContactInfo({
            fullName: `${deduplicatedData.firstName} ${deduplicatedData.lastName}`.trim(),
            email: deduplicatedData.email,
            phone: deduplicatedData.profile.phone,
            website: deduplicatedData.profile.website,
            linkedin: deduplicatedData.profile.linkedin,
            country: deduplicatedData.profile.country,
            state: deduplicatedData.profile.state,
            city: deduplicatedData.profile.city,
            showStateOnResume: deduplicatedData.profile.showStateOnResume,
            showCountryOnResume: deduplicatedData.profile.showCountryOnResume,
            showCityOnResume: deduplicatedData.profile.showCityOnResume,
            jobTitle: deduplicatedData.profile.jobTitle,
            avatar: deduplicatedData.avatar,
          }));

          // Load experiences (already deduplicated)
          dispatch(setExperiences(deduplicatedData.profile.experiences));

          // Load projects (already deduplicated)
          dispatch(setProjects(deduplicatedData.profile.projects));

          // Load educations (already deduplicated)
          dispatch(setEducations(deduplicatedData.profile.educations));

          // Load skills (already deduplicated)
          dispatch(setSkills(deduplicatedData.profile.skills));

          // Load summary
          dispatch(updateSummary(deduplicatedData.profile.summary));
        }
      } catch (error) {
        console.error('Error loading profile data from localStorage:', error);
      }
    };

    loadProfileData();
  }, [dispatch]);
};

// Hook to check if profile data exists in localStorage
export const useHasProfileData = (): boolean => {
  try {
    const storedData = userStorage.get();
    return !!(storedData && storedData.profile);
  } catch (error) {
    console.error('Error checking profile data in localStorage:', error);
    return false;
  }
};

// Hook to get profile data from localStorage (for immediate display)
export const useStoredProfileData = (): StoredUserData | null => {
  try {
    return userStorage.get();
  } catch (error) {
    console.error('Error getting profile data from localStorage:', error);
    return null;
  }
};

// Hook to manually clear duplicates from Redux store
export const useClearDuplicates = () => {
  const dispatch = useAppDispatch();
  const experiences = useAppSelector(state => state.profile.experiences);
  const projects = useAppSelector(state => state.profile.projects);
  const educations = useAppSelector(state => state.profile.educations);
  const skills = useAppSelector(state => state.profile.skills);

  const clearDuplicates = () => {
    console.log('🧹 Clearing duplicates from Redux store...');
    
    // Deduplicate experiences
    const uniqueExperiences = experiences.filter((exp, index, self) => 
      index === self.findIndex(e => e.id === exp.id)
    );
    if (uniqueExperiences.length !== experiences.length) {
      console.log(`Removed ${experiences.length - uniqueExperiences.length} duplicate experiences`);
      dispatch(setExperiences(uniqueExperiences));
    }

    // Deduplicate projects
    const uniqueProjects = projects.filter((proj, index, self) => 
      index === self.findIndex(p => p.id === proj.id)
    );
    if (uniqueProjects.length !== projects.length) {
      console.log(`Removed ${projects.length - uniqueProjects.length} duplicate projects`);
      dispatch(setProjects(uniqueProjects));
    }

    // Deduplicate educations
    const uniqueEducations = educations.filter((edu, index, self) => 
      index === self.findIndex(e => e.id === edu.id)
    );
    if (uniqueEducations.length !== educations.length) {
      console.log(`Removed ${educations.length - uniqueEducations.length} duplicate educations`);
      dispatch(setEducations(uniqueEducations));
    }

    // Deduplicate skills
    const uniqueSkills = skills.filter((skill, index, self) => 
      index === self.findIndex(s => s.id === skill.id)
    );
    if (uniqueSkills.length !== skills.length) {
      console.log(`Removed ${skills.length - uniqueSkills.length} duplicate skills`);
      dispatch(setSkills(uniqueSkills));
    }

    console.log('✅ Duplicates cleared from Redux store');
  };

  return { clearDuplicates };
};

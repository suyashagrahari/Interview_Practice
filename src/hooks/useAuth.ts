import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AuthApiService, SignUpRequest, SignInRequest, GoogleAuthRequest, User, AuthResponse } from '@/lib/api';
import { 
  setAuthTokens, 
  setUserData, 
  getAuthTokens, 
  getUserData, 
  clearAuthCookies, 
  isAuthenticated 
} from '@/lib/cookies';
import { userStorage, initializeUserData, clearAllStorage } from '@/lib/localStorage';

// Query keys for React Query
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Get current user from secure cookies
const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  return getUserData();
};

// Save user to secure cookies and localStorage
const saveUser = (user: User) => {
  if (typeof window !== 'undefined') {
    setUserData(user);
    
    // Initialize complete user data in localStorage
    const userData = initializeUserData(user);
    userStorage.set(userData);
    
    console.log('💾 User data stored in localStorage:', {
      hasProfile: !!userData.profile,
      profileSections: userData.profile ? Object.keys(userData.profile) : [],
      experiences: userData.profile?.experiences?.length || 0,
      projects: userData.profile?.projects?.length || 0,
      educations: userData.profile?.educations?.length || 0,
      skills: userData.profile?.skills?.length || 0,
    });
  }
};

// Save auth tokens to secure cookies
const saveAuthTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    setAuthTokens(accessToken, refreshToken);
  }
};

// Remove auth data from secure cookies and localStorage
const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    clearAuthCookies();
    clearAllStorage();
  }
};

// Hook to get current user profile
export const useProfile = () => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      // First try to get from localStorage if recent
      const cachedUserData = userStorage.get();
      if (cachedUserData && userStorage.isRecent()) {
        return {
          success: true,
          data: {
            id: cachedUserData.id,
            email: cachedUserData.email,
            firstName: cachedUserData.firstName,
            lastName: cachedUserData.lastName,
            avatar: cachedUserData.avatar,
            provider: cachedUserData.provider,
            isEmailVerified: cachedUserData.isEmailVerified,
            createdAt: cachedUserData.createdAt,
            updatedAt: cachedUserData.updatedAt,
            profile: cachedUserData.profile
          }
        };
      }
      
      // If no recent cache, fetch from API
      const response = await AuthApiService.getProfile();
      if (response.success && response.data) {
        // Update localStorage with fresh data
        const userData = initializeUserData(response.data);
        userStorage.set(userData);
      }
      return response;
    },
    enabled: !!getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook for sign up mutation
export const useSignUp = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignUpRequest) => AuthApiService.signUp(data),
    onSuccess: (response: AuthResponse) => {
      if (response.success) {
        saveUser(response.data.user);
        saveAuthTokens(response.data.token, response.data.refreshToken);
        
        // Update the profile query cache
        queryClient.setQueryData(authKeys.profile(), {
          success: true,
          data: response.data.user,
        });
        
        // Invalidate auth queries to refresh the authentication state
        queryClient.invalidateQueries({ queryKey: authKeys.all });
        
        toast.success('Account created successfully!');
        // Force a longer delay to ensure authentication state is fully updated
        setTimeout(() => {
          console.log('Attempting to redirect to dashboard profile after signup...');
          // Redirect new users to profile setup
          router.replace('/dashboard?profile=true');
          // Fallback to window.location if router.replace fails
          setTimeout(() => {
            if (window.location.pathname !== '/dashboard') {
              console.log('Router replace failed, using window.location...');
              window.location.href = '/dashboard?profile=true';
            }
          }, 300);
        }, 500);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create account');
    },
  });
};

// Hook for sign in mutation
export const useSignIn = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignInRequest) => AuthApiService.signIn(data),
    onSuccess: (response: AuthResponse) => {
      if (response.success) {
        console.log('✅ Sign-in successful, storing complete user data:', {
          hasProfile: !!response.data.user.profile,
          profileSections: response.data.user.profile ? Object.keys(response.data.user.profile) : [],
          experiences: response.data.user.profile?.experiences?.length || 0,
          projects: response.data.user.profile?.projects?.length || 0,
          educations: response.data.user.profile?.educations?.length || 0,
          skills: response.data.user.profile?.skills?.length || 0,
        });
        
        saveUser(response.data.user);
        saveAuthTokens(response.data.token, response.data.refreshToken);
        
        // Update the profile query cache
        queryClient.setQueryData(authKeys.profile(), {
          success: true,
          data: response.data.user,
        });
        
        // Invalidate auth queries to refresh the authentication state
        queryClient.invalidateQueries({ queryKey: authKeys.all });
        
        toast.success('Welcome back!');
        // Force a small delay to ensure authentication state is updated
        setTimeout(() => {
          console.log('Attempting to redirect to dashboard...');
          // Try router.replace first (more forceful than push)
          router.replace('/dashboard');
          // Fallback to window.location if router.replace fails
          setTimeout(() => {
            if (window.location.pathname !== '/dashboard') {
              console.log('Router replace failed, using window.location...');
              window.location.href = '/dashboard';
            }
          }, 200);
        }, 100);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to sign in');
    },
  });
};

// Hook for Google sign in mutation
export const useGoogleSignIn = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: GoogleAuthRequest) => AuthApiService.signInWithGoogle(data),
    onSuccess: (response: AuthResponse) => {
      if (response.success) {
        console.log('✅ Google sign-in successful, storing complete user data:', {
          hasProfile: !!response.data.user.profile,
          profileSections: response.data.user.profile ? Object.keys(response.data.user.profile) : [],
          experiences: response.data.user.profile?.experiences?.length || 0,
          projects: response.data.user.profile?.projects?.length || 0,
          educations: response.data.user.profile?.educations?.length || 0,
          skills: response.data.user.profile?.skills?.length || 0,
        });
        
        saveUser(response.data.user);
        saveAuthTokens(response.data.token, response.data.refreshToken);
        
        // Update the profile query cache
        queryClient.setQueryData(authKeys.profile(), {
          success: true,
          data: response.data.user,
        });
        
        // Invalidate auth queries to refresh the authentication state
        queryClient.invalidateQueries({ queryKey: authKeys.all });
        
        toast.success('Signed in with Google successfully!');
        // Force a small delay to ensure authentication state is updated
        setTimeout(() => {
          console.log('Attempting to redirect to dashboard after Google signin...');
          // Try router.replace first (more forceful than push)
          router.replace('/dashboard');
          // Fallback to window.location if router.replace fails
          setTimeout(() => {
            if (window.location.pathname !== '/dashboard') {
              console.log('Router replace failed, using window.location...');
              window.location.href = '/dashboard';
            }
          }, 200);
        }, 100);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Google sign in failed');
    },
  });
};

// Hook for logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => AuthApiService.logout(),
    onSuccess: () => {
      clearAuthData();
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/');
    },
    onError: (error: any) => {
      // Even if the API call fails, clear local data
      clearAuthData();
      queryClient.clear();
      toast.error(error.message || 'Logout failed');
      router.push('/');
    },
  });
};

// Hook for updating profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => AuthApiService.updateProfile(data),
    onSuccess: (response) => {
      if (response.success) {
        saveUser(response.data);
        queryClient.setQueryData(authKeys.profile(), response);
        toast.success('Profile updated successfully!');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

// Hook for changing password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      AuthApiService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to change password');
    },
  });
};

// Hook for forgot password
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => AuthApiService.forgotPassword(email),
    onSuccess: () => {
      toast.success('Password reset email sent!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send reset email');
    },
  });
};

// Hook for reset password
export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { token: string; password: string }) =>
      AuthApiService.resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successfully!');
      router.push('/');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reset password');
    },
  });
};

// Hook for email verification
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => AuthApiService.verifyEmail(token),
    onSuccess: () => {
      toast.success('Email verified successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to verify email');
    },
  });
};

// Hook for resending verification email
export const useResendVerification = () => {
  return useMutation({
    mutationFn: () => AuthApiService.resendVerificationEmail(),
    onSuccess: () => {
      toast.success('Verification email sent!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send verification email');
    },
  });
};

// Hook to get current user from localStorage (synchronous)
export const useCurrentUser = (): User | null => {
  return getCurrentUser();
};

// Hook to check if user is authenticated
export const useIsAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return isAuthenticated();
};

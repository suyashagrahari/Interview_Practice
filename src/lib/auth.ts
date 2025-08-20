// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

// Authentication Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  provider: 'email' | 'google';
  createdAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Google OAuth Functions
export const initializeGoogleAuth = () => {
  if (typeof window === 'undefined') return;

  // Load Google OAuth script
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  return new Promise<void>((resolve) => {
    script.onload = () => resolve();
  });
};

export const signInWithGoogle = async (): Promise<AuthResponse | null> => {
  if (typeof window === 'undefined' || !window.google) {
    console.error('Google OAuth not loaded');
    return null;
  }

  try {
    interface GoogleCredentialResponse {
      credential: string;
      select_by: string;
    }

    const response = await new Promise<GoogleCredentialResponse>((resolve, reject) => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: resolve,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            reject(new Error('Google OAuth prompt failed'));
          }
        });
      } else {
        reject(new Error('Google OAuth not available'));
      }
    });

    if (response.credential) {
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const user: User = {
        id: payload.sub,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        avatar: payload.picture,
        provider: 'google',
        createdAt: new Date(),
      };

      // In a real app, you would send this to your backend
      // For now, we'll simulate a successful response
      const token = response.credential;
      
      return { user, token };
    }
  } catch (error) {
    console.error('Google OAuth error:', error);
  }

  return null;
};

// Email/Password Authentication Functions
export const signInWithEmail = async (email: string, password: string): Promise<AuthResponse | null> => {
  try {
    // In a real app, you would make an API call to your backend
    // For now, we'll simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate user data
    const user: User = {
      id: 'email-user-123',
      email,
      provider: 'email',
      createdAt: new Date(),
    };

    const token = 'email-token-' + Math.random().toString(36).substr(2, 9);
    
    return { user, token };
  } catch (error) {
    console.error('Email sign in error:', error);
    return null;
  }
};

export const signUpWithEmail = async (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string
): Promise<AuthResponse | null> => {
  try {
    // In a real app, you would make an API call to your backend
    // For now, we'll simulate account creation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate user data
    const user: User = {
      id: 'email-user-' + Math.random().toString(36).substr(2, 9),
      email,
      firstName,
      lastName,
      provider: 'email',
      createdAt: new Date(),
    };

    const token = 'email-token-' + Math.random().toString(36).substr(2, 9);
    
    return { user, token };
  } catch (error) {
    console.error('Email sign up error:', error);
    return null;
  }
};

// Token Management
export const saveAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

// User Management
export const saveUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

export const removeUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

// Logout
export const logout = () => {
  removeAuthToken();
  removeUser();
  // In a real app, you might also want to call your backend to invalidate the token
};

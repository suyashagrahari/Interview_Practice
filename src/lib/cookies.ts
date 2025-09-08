import Cookies from 'js-cookie';

// Cookie configuration for security
const COOKIE_CONFIG = {
  secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
  sameSite: 'strict' as const, // CSRF protection
  httpOnly: false, // Allow client-side access (needed for js-cookie)
  expires: 7, // 7 days
};

// Cookie names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
} as const;

// Set secure cookie
export const setSecureCookie = (name: string, value: string, options?: Partial<typeof COOKIE_CONFIG>) => {
  const cookieOptions = {
    ...COOKIE_CONFIG,
    ...options,
  };

  // Convert expires days to date
  if (cookieOptions.expires) {
    const date = new Date();
    date.setTime(date.getTime() + (cookieOptions.expires * 24 * 60 * 60 * 1000));
    cookieOptions.expires = date;
  }

  Cookies.set(name, value, cookieOptions);
};

// Get cookie
export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

// Remove cookie
export const removeCookie = (name: string) => {
  Cookies.remove(name, {
    secure: COOKIE_CONFIG.secure,
    sameSite: COOKIE_CONFIG.sameSite,
  });
};

// Set authentication tokens
export const setAuthTokens = (accessToken: string, refreshToken: string) => {
  setSecureCookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken);
  setSecureCookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken);
};

// Get authentication tokens
export const getAuthTokens = () => {
  return {
    accessToken: getCookie(COOKIE_NAMES.ACCESS_TOKEN),
    refreshToken: getCookie(COOKIE_NAMES.REFRESH_TOKEN),
  };
};

// Set user data
export const setUserData = (userData: any) => {
  setSecureCookie(COOKIE_NAMES.USER_DATA, JSON.stringify(userData));
};

// Get user data
export const getUserData = () => {
  const userData = getCookie(COOKIE_NAMES.USER_DATA);
  return userData ? JSON.parse(userData) : null;
};

// Clear all auth cookies
export const clearAuthCookies = () => {
  removeCookie(COOKIE_NAMES.ACCESS_TOKEN);
  removeCookie(COOKIE_NAMES.REFRESH_TOKEN);
  removeCookie(COOKIE_NAMES.USER_DATA);
};

// Check if user is authenticated (has valid tokens)
export const isAuthenticated = (): boolean => {
  const { accessToken, refreshToken } = getAuthTokens();
  return !!(accessToken && refreshToken);
};

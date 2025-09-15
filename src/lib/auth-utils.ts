// Authentication utility functions for checking user authentication status
import { isAuthenticated as checkAuthCookies, getUserData } from "@/lib/cookies";
import { userStorage } from "@/lib/localStorage";

export interface AuthCheckResult {
  isAuthenticated: boolean;
  user: any;
  source: 'context' | 'cookies' | 'localStorage' | 'none';
  debugInfo: {
    contextAuth: boolean;
    contextUser: boolean;
    cookiesAuth: boolean;
    cookiesUser: boolean;
    localStorageAuth: boolean;
    localStorageUser: boolean;
    localStorageRecent: boolean;
  };
}

/**
 * Comprehensive authentication check that verifies user status from multiple sources
 * @param contextAuth - Authentication status from React context
 * @param contextUser - User data from React context
 * @returns AuthCheckResult with detailed authentication information
 */
export const checkUserAuthentication = (
  contextAuth: boolean,
  contextUser: any
): AuthCheckResult => {
  // Check authentication from multiple sources
  const isAuthFromContext = contextAuth && contextUser;
  const isAuthFromCookies = checkAuthCookies();
  const userFromCookies = getUserData();
  const userFromLocalStorage = userStorage.get();
  const isAuthFromLocalStorage = !!userFromLocalStorage && userStorage.isRecent();

  // Determine the primary authentication source
  let source: 'context' | 'cookies' | 'localStorage' | 'none' = 'none';
  let user: any = null;
  let isAuthenticated = false;

  if (isAuthFromContext) {
    source = 'context';
    user = contextUser;
    isAuthenticated = true;
  } else if (isAuthFromCookies && userFromCookies) {
    source = 'cookies';
    user = userFromCookies;
    isAuthenticated = true;
  } else if (isAuthFromLocalStorage) {
    source = 'localStorage';
    user = userFromLocalStorage;
    isAuthenticated = true;
  }

  return {
    isAuthenticated,
    user,
    source,
    debugInfo: {
      contextAuth: isAuthFromContext,
      contextUser: !!contextUser,
      cookiesAuth: isAuthFromCookies,
      cookiesUser: !!userFromCookies,
      localStorageAuth: isAuthFromLocalStorage,
      localStorageUser: !!userFromLocalStorage,
      localStorageRecent: userStorage.isRecent(),
    },
  };
};

/**
 * Simple authentication check that returns just the boolean status
 * @param contextAuth - Authentication status from React context
 * @param contextUser - User data from React context
 * @returns boolean indicating if user is authenticated
 */
export const isUserAuthenticated = (
  contextAuth: boolean,
  contextUser: any
): boolean => {
  return checkUserAuthentication(contextAuth, contextUser).isAuthenticated;
};

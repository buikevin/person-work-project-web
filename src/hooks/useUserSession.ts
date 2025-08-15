import { useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import { useUserData } from './useUserData';

/**
 * Hook to manage user session and automatically fetch user data when needed
 * This hook coordinates between authentication state and user data fetching
 */
export const useUserSession = () => {
  const { isAuthenticated, user, accessToken } = useAppSelector((state) => state.auth);
  const { userData, loading, error, refetchUser, hasUserData, userId } = useUserData();

  // Debug the session state
  useEffect(() => {
    const sessionState = {
      isAuthenticated,
      hasAccessToken: !!accessToken,
      hasUser: !!user,
      hasUserData,
      userId,
      loading
    };
    
    console.log('🔄 User session state:', sessionState);

    // Log when user data is successfully loaded
    if (isAuthenticated && user && !loading) {
      console.log('✅ User session fully loaded:', {
        username: user.username,
        email: user.email,
        fullName: user.fullName
      });
    }
  }, [isAuthenticated, accessToken, user, hasUserData, userId, loading]);

  return {
    // Authentication state
    isAuthenticated,
    isLoading: loading,
    
    // User data
    user: user || userData, // Prefer Redux user data, fallback to query data
    hasUserData: hasUserData || !!userData,
    
    // Session management
    userId,
    refetchUser,
    
    // Status flags
    isSessionReady: isAuthenticated && !!user && !loading,
    isSessionLoading: isAuthenticated && !user && loading,
    hasError: !!error,
    error,
  };
};

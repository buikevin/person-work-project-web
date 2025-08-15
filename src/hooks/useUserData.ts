import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateUser } from '../store/slices/authSlice';
import { GET_USER_QUERY } from '../graphql/operations/user';
import { mapUserResponseToUser } from '../utils/authMappers';

export const useUserData = () => {
  const dispatch = useAppDispatch();
  const { user, accessToken, isAuthenticated } = useAppSelector((state) => state.auth);

  // Get userId from localStorage (this is always available after login)
  const userId = localStorage.getItem('userId');

  const { data, loading, error, refetch } = useQuery(GET_USER_QUERY, {
    variables: { id: userId || '' },
    skip: !userId || !accessToken || !isAuthenticated, // Skip if no user ID or not authenticated
    fetchPolicy: 'cache-first', // Use cache if available, then network
    errorPolicy: 'all', // Return both data and errors
    onCompleted: (data) => {
      if (data?.user) {
        // Update user data in Redux store
        const mappedUser = mapUserResponseToUser(data.user);
        dispatch(updateUser(mappedUser));
        console.log('✅ User data fetched and updated:', mappedUser);
      }
    },
    onError: (error) => {
      console.error('❌ Failed to fetch user data:', error);
    }
  });

  // Debug information
  useEffect(() => {
    if (userId && accessToken && isAuthenticated) {
      console.log('🔍 useUserData conditions:', {
        userId,
        hasAccessToken: !!accessToken,
        isAuthenticated,
        hasUser: !!user,
        loading
      });
    }
  }, [userId, accessToken, isAuthenticated, user, loading]);

  return {
    userData: data?.user,
    loading,
    error,
    refetchUser: refetch,
    // Additional helper properties
    hasUserData: !!user,
    userId,
  };
};

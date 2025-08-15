import { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { useAuth } from './useAuth';

export const useAuthErrorHandler = () => {
  const client = useApolloClient();
  const dispatch = useAppDispatch();
  const { refreshToken: refreshTokenFn } = useAuth();
  const { refreshToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Handle GraphQL errors globally
    const errorHandler = (error: any) => {
      if (error.networkError) {
        // Check for authentication errors
        if (error.networkError.statusCode === 401) {
          // Try to refresh token
          if (refreshToken) {
            refreshTokenFn({ refreshToken })
              .then((result) => {
                if (!result.success) {
                  // Refresh failed, logout user
                  dispatch(logout());
                }
              })
              .catch(() => {
                // Refresh failed, logout user
                dispatch(logout());
              });
          } else {
            // No refresh token available, logout user
            dispatch(logout());
          }
        }
      }

      // Check for GraphQL errors that indicate authentication issues
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach((err: any) => {
          if (err.extensions?.code === 'UNAUTHENTICATED' || 
              err.extensions?.code === 'FORBIDDEN' ||
              err.message.includes('Unauthorized')) {
            dispatch(logout());
          }
        });
      }
    };

    // You can add this to Apollo Client's error link if needed
    // For now, we'll handle errors in individual components

    return () => {
      // Cleanup if needed
    };
  }, [client, dispatch, refreshToken, refreshTokenFn]);

  return {
    // Return any utility functions if needed
  };
};

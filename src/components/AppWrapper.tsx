import React, { useEffect, startTransition } from 'react';
import { RouterProvider } from 'react-router';
import { useAppDispatch } from '../store/hooks';
import { restoreSession } from '../store/slices/authSlice';
import { useAuthErrorHandler } from '../hooks/useAuthErrorHandler';
import { AuthLoader } from './AuthLoader';
import { router } from '../router/router';

export const AppWrapper: React.FC = () => {
  const dispatch = useAppDispatch();

  // Initialize auth error handling
  useAuthErrorHandler();

  useEffect(() => {
    // Wrap session restoration in startTransition to avoid suspense issues
    startTransition(() => {
      dispatch(restoreSession());
    });
  }, [dispatch]);

  return (
    <AuthLoader>
      <RouterProvider router={router} />
    </AuthLoader>
  );
};

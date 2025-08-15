import React, { Suspense } from 'react';
import { useUserSession } from '../hooks/useUserSession';
import { Loader2 } from 'lucide-react';

interface AuthLoaderProps {
  children: React.ReactNode;
}

const LoadingFallback = ({ message = "Đang tải..." }: { message?: string }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  </div>
);

export const AuthLoader: React.FC<AuthLoaderProps> = ({ children }) => {
  const { isSessionLoading, isAuthenticated } = useUserSession();

  // Show loading while user session is being established
  if (isSessionLoading) {
    return <LoadingFallback message="Đang tải thông tin người dùng..." />;
  }

  return (
    <Suspense fallback={<LoadingFallback message="Đang tải ứng dụng..." />}>
      {children}
    </Suspense>
  );
};

import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { restoreSession } from '../../store/slices/authSlice';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    // Try to restore session on app load
    dispatch(restoreSession());
  }, [dispatch]);

  if (isAuthenticated) {
    // Redirect to intended location or projects
    const from = (location.state as any)?.from?.pathname || '/projects';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;

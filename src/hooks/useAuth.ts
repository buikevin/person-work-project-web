import { useMutation } from '@apollo/client';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess, logout as logoutAction } from '../store/slices/authSlice';
import {
  LOGIN_MUTATION,
  REFRESH_TOKEN_MUTATION,
  LOGOUT_MUTATION,
  type LoginInput,
  type RefreshTokenInput
} from '../graphql/operations/auth';
import { createLoginSuccessPayload } from '../utils/authMappers';

export const useAuth = () => {
  const dispatch = useAppDispatch();

  const [loginMutation, { loading: loginLoading, error: loginError }] = useMutation(LOGIN_MUTATION);
  const [refreshTokenMutation, { loading: refreshLoading, error: refreshError }] = useMutation(REFRESH_TOKEN_MUTATION);
  const [logoutMutation, { loading: logoutLoading, error: logoutError }] = useMutation(LOGOUT_MUTATION);

  const login = async (loginInput: LoginInput) => {
    try {
      const { data } = await loginMutation({
        variables: { loginInput }
      });

      if (data?.login) {
        const authResponse = data.login;

        // Store tokens and userId in localStorage
        localStorage.setItem('accessToken', authResponse.accessToken);
        localStorage.setItem('refreshToken', authResponse.refreshToken);
        localStorage.setItem('tokenType', authResponse.tokenType);
        localStorage.setItem('expiresIn', authResponse.expiresIn.toString());
        localStorage.setItem('userId', authResponse.userId);

        // Update Redux state with login success
        // Note: useUserData hook will automatically fetch user data after this
        dispatch(loginSuccess(createLoginSuccessPayload(authResponse)));

        console.log('✅ Login successful, userId stored:', authResponse.userId);
        console.log('📡 useUserData hook will automatically fetch user data');

        return { success: true, data: authResponse };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error };
    }
  };

  const refreshToken = async (refreshTokenInput: RefreshTokenInput) => {
    try {
      const { data } = await refreshTokenMutation({
        variables: { refreshTokenInput }
      });

      if (data?.refreshToken) {
        const authResponse = data.refreshToken;
        
        // Update tokens in localStorage
        localStorage.setItem('accessToken', authResponse.accessToken);
        localStorage.setItem('refreshToken', authResponse.refreshToken);
        localStorage.setItem('expiresIn', authResponse.expiresIn.toString());

        return { success: true, data: authResponse };
      }
    } catch (error) {
      console.error('Refresh token error:', error);
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      await logoutMutation({
        variables: { refreshToken }
      });

      // Clear tokens from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenType');
      localStorage.removeItem('expiresIn');
      localStorage.removeItem('userId');

      // Update Redux state
      dispatch(logoutAction());

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if logout fails on server, clear local data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenType');
      localStorage.removeItem('expiresIn');
      localStorage.removeItem('userId');
      dispatch(logoutAction());
      
      return { success: false, error };
    }
  };

  return {
    login,
    refreshToken,
    logout,
    loading: loginLoading || refreshLoading || logoutLoading,
    error: loginError || refreshError || logoutError
  };
};

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserResponse, UserStatus } from '../../graphql/user';
import { AuthResponse } from '../../graphql/auth';

// Create a type alias for better semantic meaning in auth context
export type User = UserResponse & {
  id: string; // Map _id to id for consistency
};

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  expiresIn: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  tokenType: localStorage.getItem('tokenType'),
  expiresIn: localStorage.getItem('expiresIn') ? parseInt(localStorage.getItem('expiresIn')!) : null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  rememberMe: localStorage.getItem('rememberMe') === 'true',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action: PayloadAction<{
      user: User;
      authResponse: AuthResponse;
      rememberMe?: boolean;
    }>) => {
      // Store user data only in Redux
      state.user = action.payload.user;
      state.accessToken = action.payload.authResponse.accessToken;
      state.refreshToken = action.payload.authResponse.refreshToken;
      state.tokenType = action.payload.authResponse.tokenType;
      state.expiresIn = action.payload.authResponse.expiresIn;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.rememberMe = action.payload.rememberMe || false;

      // Store only tokens and essential info in localStorage
      localStorage.setItem('accessToken', action.payload.authResponse.accessToken);
      localStorage.setItem('refreshToken', action.payload.authResponse.refreshToken);
      localStorage.setItem('tokenType', action.payload.authResponse.tokenType);
      localStorage.setItem('expiresIn', action.payload.authResponse.expiresIn.toString());
      localStorage.setItem('userId', action.payload.user.id);
      if (action.payload.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenType = null;
      state.expiresIn = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    logout: (state) => {
      // Clear Redux state
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenType = null;
      state.expiresIn = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.rememberMe = false;

      // Clear only tokens from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenType');
      localStorage.removeItem('expiresIn');
      localStorage.removeItem('userId');
      localStorage.removeItem('rememberMe');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        // Update user data only in Redux state
        state.user = { ...state.user, ...action.payload };
        // No localStorage storage for user data
      }
    },
    restoreSession: (state) => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const tokenType = localStorage.getItem('tokenType');
      const expiresIn = localStorage.getItem('expiresIn');
      const userId = localStorage.getItem('userId');
      const rememberMe = localStorage.getItem('rememberMe') === 'true';

      // Only restore tokens, user data will be fetched from server
      if (accessToken && userId) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.tokenType = tokenType;
        state.expiresIn = expiresIn ? parseInt(expiresIn) : null;
        state.isAuthenticated = true;
        state.rememberMe = rememberMe;
        // user will be null until fetched from server
        state.user = null;
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  restoreSession,
} = authSlice.actions;

export default authSlice.reducer;

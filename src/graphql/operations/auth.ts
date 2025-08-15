import { gql } from '@apollo/client';

// Re-export types for easier importing in components
export type {
  LoginInput,
  RefreshTokenInput,
  AuthResponse,
  LogoutResponse
} from '../auth';

// Login mutation
export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      refreshToken
      tokenType
      expiresIn
      userId
      username
    }
  }
`;

// Refresh token mutation
export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshTokenInput: RefreshTokenInput!) {
    refreshToken(refreshTokenInput: $refreshTokenInput) {
      accessToken
      refreshToken
      tokenType
      expiresIn
      userId
      username
    }
  }
`;

// Logout mutation
export const LOGOUT_MUTATION = gql`
  mutation Logout($refreshToken: String) {
    logout(refreshToken: $refreshToken) {
      message
      success
    }
  }
`;

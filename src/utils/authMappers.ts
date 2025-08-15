import { UserResponse, UserStatus } from '../graphql/user';
import { AuthResponse } from '../graphql/auth';
import { User } from '../store/slices/authSlice';

/**
 * Maps GraphQL UserResponse to Redux User type
 * This ensures consistency between GraphQL schema and Redux state
 */
export const mapUserResponseToUser = (userResponse: UserResponse): User => {
  return {
    ...userResponse,
    id: userResponse._id, // Map _id to id for frontend consistency
  };
};

/**
 * Maps minimal auth response data to User type for initial login
 */
export const mapAuthResponseToMinimalUser = (authResponse: AuthResponse): User => {
  return {
    _id: authResponse.userId,
    id: authResponse.userId,
    username: authResponse.username,
    email: '', // Will be fetched from server
    fullName: '',
    phoneNumber: '',
    address: null,
    dateOfBirth: null,
    status: UserStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Creates login success payload with proper types
 */
export const createLoginSuccessPayload = (
  authResponse: AuthResponse,
  rememberMe?: boolean
) => {
  return {
    user: mapAuthResponseToMinimalUser(authResponse),
    authResponse,
    rememberMe,
  };
};

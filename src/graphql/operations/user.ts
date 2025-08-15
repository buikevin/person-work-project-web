import { gql } from '@apollo/client';

// Re-export types for easier importing in components
export type {
  User,
  UserResponse,
  UserStatus,
  CreateUserInput,
  UpdateUserInput,
  UpdatePasswordInput
} from '../user';

// Get current user query
export const GET_USER_QUERY = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      _id
      username
      fullName
      email
      phoneNumber
      status
      address
      dateOfBirth
      createdAt
      updatedAt
    }
  }
`;

// Get user by username query
export const GET_USER_BY_USERNAME_QUERY = gql`
  query GetUserByUsername($username: String!) {
    userByUsername(username: $username) {
      _id
      username
      fullName
      email
      phoneNumber
      status
      address
      dateOfBirth
      createdAt
      updatedAt
    }
  }
`;

// Get user by email query
export const GET_USER_BY_EMAIL_QUERY = gql`
  query GetUserByEmail($email: String!) {
    userByEmail(email: $email) {
      _id
      username
      fullName
      email
      phoneNumber
      status
      address
      dateOfBirth
      createdAt
      updatedAt
    }
  }
`;

// Create user mutation
export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      _id
      username
      fullName
      email
      phoneNumber
      status
      address
      dateOfBirth
      createdAt
      updatedAt
    }
  }
`;

// Update user mutation
export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      _id
      username
      fullName
      email
      phoneNumber
      status
      address
      dateOfBirth
      createdAt
      updatedAt
    }
  }
`;

// Update password mutation
export const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdatePassword($updatePasswordInput: UpdatePasswordInput!) {
    updatePassword(updatePasswordInput: $updatePasswordInput) {
      _id
      username
      fullName
      email
      phoneNumber
      status
      address
      dateOfBirth
      createdAt
      updatedAt
    }
  }
`;

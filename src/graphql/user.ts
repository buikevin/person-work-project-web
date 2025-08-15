/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface CreateUserInput {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  status?: Nullable<UserStatus>;
  address?: Nullable<string>;
  dateOfBirth?: Nullable<DateTime>;
}

export interface UpdateUserInput {
  username?: Nullable<string>;
  password?: Nullable<string>;
  fullName?: Nullable<string>;
  email?: Nullable<string>;
  phoneNumber?: Nullable<string>;
  status?: Nullable<UserStatus>;
  address?: Nullable<string>;
  dateOfBirth?: Nullable<DateTime>;
  id: string;
}

export interface UpdatePasswordInput {
  id: string;
  currentPassword: string;
  newPassword: string;
}

export interface User {
  _id?: Nullable<string>;
  username: string;
  password: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: UserStatus;
  address?: Nullable<string>;
  dateOfBirth?: Nullable<DateTime>;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface UserResponse {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: UserStatus;
  address?: Nullable<string>;
  dateOfBirth?: Nullable<DateTime>;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface IQuery {
  users(): UserResponse[] | Promise<UserResponse[]>;
  user(id: string): UserResponse | Promise<UserResponse>;
  userByUsername(username: string): User | Promise<User>;
  userByEmail(email: string): UserResponse | Promise<UserResponse>;
}

export interface IMutation {
  createUser(
    createUserInput: CreateUserInput
  ): UserResponse | Promise<UserResponse>;
  updateUser(
    updateUserInput: UpdateUserInput
  ): UserResponse | Promise<UserResponse>;
  updatePassword(
    updatePasswordInput: UpdatePasswordInput
  ): UserResponse | Promise<UserResponse>;
  removeUser(id: string): UserResponse | Promise<UserResponse>;
}

export type DateTime = any;
type Nullable<T> = T | null;

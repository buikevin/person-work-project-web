/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface LoginInput {
  username: string;
  password: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  username: string;
}

export interface LogoutResponse {
  message: string;
  success: boolean;
}

export interface IMutation {
  login(loginInput: LoginInput): AuthResponse | Promise<AuthResponse>;
  refreshToken(
    refreshTokenInput: RefreshTokenInput
  ): AuthResponse | Promise<AuthResponse>;
  logout(
    refreshToken?: Nullable<string>
  ): LogoutResponse | Promise<LogoutResponse>;
}

type Nullable<T> = T | null;

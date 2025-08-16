/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum ProjectStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  INACTIVE = "INACTIVE",
}

export interface ProjectMetadataInput {
  backend?: Nullable<string>;
  frontend?: Nullable<string>;
  database?: Nullable<string>;
  transparent?: Nullable<string>;
  framework?: Nullable<string>;
  model?: Nullable<string>;
}

export interface ReadFileInput {
  slug: string;
  path: string;
}

export interface CreateProjectInput {
  name: string;
  slug: string;
  status: ProjectStatus;
  avatar?: Nullable<string>;
  linkgit?: Nullable<string>;
  description?: Nullable<string>;
  metadata?: Nullable<ProjectMetadataInput>;
}

export interface UpdateProjectInput {
  _id?: Nullable<string>;
  name?: Nullable<string>;
  slug?: Nullable<string>;
  status?: Nullable<ProjectStatus>;
  avatar?: Nullable<string>;
  linkgit?: Nullable<string>;
  description?: Nullable<string>;
  metadata?: Nullable<ProjectMetadataInput>;
}

export interface CreateFileInput {
  slug: string;
  path: string;
  type: string;
  content?: Nullable<string>;
}

export interface UpdateFileInput {
  slug: string;
  path: string;
  content: string;
}

export interface DeleteFileInput {
  slug: string;
  path: string;
}

export interface RenameFileInput {
  slug: string;
  oldPath: string;
  newPath: string;
}

export interface CreateChatInput {
  message: string;
  userId: string;
  projectId: string;
}

export interface ProjectMetadata {
  backend?: Nullable<string>;
  frontend?: Nullable<string>;
  database?: Nullable<string>;
  transparent?: Nullable<string>;
  framework?: Nullable<string>;
  model?: Nullable<string>;
}

export interface FileNode {
  name: string;
  type: string;
  path: string;
  parentPath?: Nullable<string>;
  language?: Nullable<string>;
  content?: Nullable<string>;
}

export interface FileContent {
  content: string;
  language?: Nullable<string>;
}

export interface Project {
  _id: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  avatar?: Nullable<string>;
  linkgit?: Nullable<string>;
  metadata?: Nullable<ProjectMetadata>;
  description?: Nullable<string>;
  path: string;
  content?: Nullable<FileNode[]>;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface Chat {
  _id: string;
  message: string;
  userId: string;
  projectId: string;
  response?: Nullable<string>;
  status: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface ChatMessage {
  message: string;
  userId: string;
  projectId: string;
  response?: Nullable<string>;
  status: string;
  timestamp: DateTime;
}

export interface ChatResponse {
  message: string;
}

export interface IQuery {
  projects(): Project[] | Promise<Project[]>;
  project(id: string): Project | Promise<Project>;
  projectBySlug(slug: string): Project | Promise<Project>;
  readFile(input: ReadFileInput): FileContent | Promise<FileContent>;
  chatsByUserAndProject(
    userId: string,
    projectId: string,
  ): ChatMessage[] | Promise<ChatMessage[]>;
  chats(): Chat[] | Promise<Chat[]>;
  chat(id: string): Nullable<Chat> | Promise<Nullable<Chat>>;
}

export interface IMutation {
  createProject(
    createProjectInput: CreateProjectInput,
  ): Project | Promise<Project>;
  updateProject(
    updateProjectInput: UpdateProjectInput,
  ): Project | Promise<Project>;
  removeProject(id: string): Project | Promise<Project>;
  createFileOrFolder(input: CreateFileInput): boolean | Promise<boolean>;
  updateFile(input: UpdateFileInput): boolean | Promise<boolean>;
  deleteFileOrFolder(input: DeleteFileInput): boolean | Promise<boolean>;
  renameFileOrFolder(input: RenameFileInput): boolean | Promise<boolean>;
  createChat(
    createChatInput: CreateChatInput,
  ): ChatResponse | Promise<ChatResponse>;
}

export interface ISubscription {
  fileCreated(): string | Promise<string>;
  fileUpdated(): string | Promise<string>;
  fileDeleted(): string | Promise<string>;
  fileRenamed(): string | Promise<string>;
  chatUpdated(
    projectId: string,
    userId: string,
  ): ChatResponse | Promise<ChatResponse>;
}

export type DateTime = any;
type Nullable<T> = T | null;

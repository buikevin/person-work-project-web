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

export interface ChatMessage {
  role: string;
  content: string;
  timestamp: DateTime;
}

export interface ChatBucket {
  _id: string;
  sessionId: string;
  userId: string;
  projectId: string;
  messages: ChatMessage[];
  count: number;
  isFull: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface ChatPaginationResponse {
  messages: ChatMessage[];
  totalMessages: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IQuery {
  projects(): Project[] | Promise<Project[]>;
  project(id: string): Project | Promise<Project>;
  projectBySlug(slug: string): Project | Promise<Project>;
  readFile(input: ReadFileInput): FileContent | Promise<FileContent>;
  chatsByUserAndProject(
    userId: string,
    projectId: string
  ): ChatMessage[] | Promise<ChatMessage[]>;
  chatsByUserAndProjectPaginated(
    userId: string,
    projectId: string,
    page: number,
    limit: number
  ): ChatPaginationResponse | Promise<ChatPaginationResponse>;
}

export interface IMutation {
  createProject(
    createProjectInput: CreateProjectInput
  ): Project | Promise<Project>;
  updateProject(
    updateProjectInput: UpdateProjectInput
  ): Project | Promise<Project>;
  removeProject(id: string): Project | Promise<Project>;
  createFileOrFolder(input: CreateFileInput): boolean | Promise<boolean>;
  updateFile(input: UpdateFileInput): boolean | Promise<boolean>;
  deleteFileOrFolder(input: DeleteFileInput): boolean | Promise<boolean>;
  renameFileOrFolder(input: RenameFileInput): boolean | Promise<boolean>;
  createChat(
    createChatInput: CreateChatInput
  ): ChatMessage | Promise<ChatMessage>;
}

export interface ISubscription {
  fileCreated(): string | Promise<string>;
  fileUpdated(): string | Promise<string>;
  fileDeleted(): string | Promise<string>;
  fileRenamed(): string | Promise<string>;
  chatUpdated(
    projectId: string,
    userId: string
  ): ChatMessage | Promise<ChatMessage>;
}

export type DateTime = any;
type Nullable<T> = T | null;

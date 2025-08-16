import { gql } from "@apollo/client";

// Re-export types for easier importing in components
export type {
  Project,
  ProjectStatus,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectMetadata,
  ProjectMetadataInput,
  FileNode,
  FileContent,
  ReadFileInput,
  CreateChatInput,
  Chat,
  ChatMessage,
  ChatResponse,
} from "../project";

// Get all projects query
export const GET_PROJECTS_QUERY = gql`
  query GetProjects {
    projects {
      _id
      name
      slug
      status
      avatar
      description
      path
      createdAt
      updatedAt
    }
  }
`;

// Get project by ID query (without file content for performance)
export const GET_PROJECT_QUERY = gql`
  query GetProject($id: String!) {
    project(id: $id) {
      _id
      name
      slug
      status
      avatar
      linkgit
      description
      path
      metadata {
        backend
        frontend
        database
        transparent
        framework
        model
      }
      content {
        name
        type
        path
        parentPath
        language
        content
      }
    }
  }
`;

// Get file content by ReadFileInput
export const READ_FILE_QUERY = gql`
  query ReadFile($input: ReadFileInput!) {
    readFile(input: $input) {
      content
      language
    }
  }
`;

// Get project by slug query
export const GET_PROJECT_BY_SLUG_QUERY = gql`
  query GetProjectBySlug($slug: String!) {
    projectBySlug(slug: $slug) {
      _id
      name
      slug
      status
      avatar
      linkgit
      description
      path
      metadata {
        backend
        frontend
        database
        transparent
        framework
        model
      }
      content {
        name
        type
        children {
          name
          type
          children {
            name
            type
            content
            language
          }
          content
          language
        }
        content
        language
      }
      createdAt
      updatedAt
    }
  }
`;

// Create project mutation
export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($createProjectInput: CreateProjectInput!) {
    createProject(createProjectInput: $createProjectInput) {
      _id
      name
      slug
      status
      avatar
      linkgit
      description
      path
      metadata {
        backend
        frontend
        database
        transparent
        framework
        model
      }
      createdAt
      updatedAt
    }
  }
`;

// Update project mutation
export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($updateProjectInput: UpdateProjectInput!) {
    updateProject(updateProjectInput: $updateProjectInput) {
      _id
      name
      slug
      status
      avatar
      linkgit
      description
      path
      metadata {
        backend
        frontend
        database
        transparent
        framework
        model
      }
      createdAt
      updatedAt
    }
  }
`;

// Remove project mutation
export const REMOVE_PROJECT_MUTATION = gql`
  mutation RemoveProject($id: ID!) {
    removeProject(id: $id) {
      _id
      name
      slug
      status
    }
  }
`;

// File operations mutations
export const CREATE_FILE_MUTATION = gql`
  mutation CreateFileOrFolder($input: CreateFileInput!) {
    createFileOrFolder(input: $input)
  }
`;

export const DELETE_FILE_MUTATION = gql`
  mutation DeleteFileOrFolder($input: DeleteFileInput!) {
    deleteFileOrFolder(input: $input)
  }
`;

export const RENAME_FILE_MUTATION = gql`
  mutation RenameFileOrFolder($input: RenameFileInput!) {
    renameFileOrFolder(input: $input)
  }
`;

export const UPDATE_FILE_MUTATION = gql`
  mutation UpdateFile($input: UpdateFileInput!) {
    updateFile(input: $input)
  }
`;

// Chat operations
export const GET_CHATS_BY_USER_AND_PROJECT_QUERY = gql`
  query ChatsByUserAndProjectPaginated($userId: String!, $projectId: String!, $page: Int!, $limit: Int!) {
    chatsByUserAndProjectPaginated(userId: $userId, projectId: $projectId, page: $page, limit: $limit) {
      messages {
        role
        content
        timestamp
      }
      totalMessages
      totalPages
      currentPage
      hasNextPage
      hasPrevPage
    }
  }
`;

export const CREATE_CHAT_MUTATION = gql`
  mutation CreateChat($createChatInput: CreateChatInput!) {
    createChat(createChatInput: $createChatInput) {
      message
    }
  }
`;

export const CHAT_UPDATED_SUBSCRIPTION = gql`
  subscription ChatUpdated($projectId: String!, $userId: String!) {
    chatUpdated(projectId: $projectId, userId: $userId) {
      message
    }
  }
`;

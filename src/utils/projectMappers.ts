import { Project as GraphQLProject, ProjectStatus } from "../graphql/project";

// Extended Project type for UI components that need id field
export type UIProject = GraphQLProject & { id: string };

/**
 * Map GraphQL Project response to local Project interface for UI components
 */
/**
 * Map GraphQL Project to add `id` field for compatibility with UI components
 * Most UI components expect `id` but GraphQL uses `_id`
 */
export const mapGraphQLProjectToLocal = (
  graphqlProject: GraphQLProject
): UIProject => {
  return {
    ...graphqlProject,
    id: graphqlProject._id || "", // Add id field for UI compatibility
  };
};

/**
 * Map local project data to GraphQL CreateProjectInput
 */
export const mapLocalToCreateProjectInput = (localProject: {
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
  linkgit?: string;
  metadata?: {
    backend?: string;
    frontend?: string;
    database?: string;
    framework?: string;
    model?: string;
    transparent?: string;
  };
}) => {
  return {
    name: localProject.name,
    slug: localProject.slug,
    status: ProjectStatus.ACTIVE, // Default to ACTIVE
    description: localProject.description || null,
    avatar: localProject.avatar || null,
    linkgit: localProject.linkgit || null,
    metadata: localProject.metadata
      ? {
          backend: localProject.metadata.backend || null,
          frontend: localProject.metadata.frontend || null,
          database: localProject.metadata.database || null,
          framework: localProject.metadata.framework || null,
          model: localProject.metadata.model || null,
          transparent: localProject.metadata.transparent || null,
        }
      : null,
  };
};

/**
 * Generate project status badge variant
 */
export const getProjectStatusVariant = (status: ProjectStatus | string) => {
  const statusStr = typeof status === "string" ? status : status.toLowerCase();
  switch (statusStr.toLowerCase()) {
    case "active":
      return "default";
    case "pending":
      return "secondary";
    case "inactive":
      return "destructive";
    default:
      return "outline";
  }
};

/**
 * Format project status for display
 */
export const formatProjectStatus = (status: ProjectStatus | string) => {
  const statusStr = typeof status === "string" ? status : status.toLowerCase();
  switch (statusStr.toLowerCase()) {
    case "active":
      return "Hoạt động";
    case "pending":
      return "Đang chờ";
    case "inactive":
      return "Tạm dừng";
    default:
      return statusStr;
  }
};

/**
 * Get technology icon/color based on framework
 */
export const getTechIcon = (tech: string) => {
  const techLower = tech.toLowerCase();

  if (techLower.includes("react"))
    return { icon: "⚛️", color: "text-blue-500" };
  if (techLower.includes("vue")) return { icon: "💚", color: "text-green-500" };
  if (techLower.includes("angular"))
    return { icon: "🅰️", color: "text-red-500" };
  if (techLower.includes("next")) return { icon: "▲", color: "text-black" };
  if (techLower.includes("nuxt"))
    return { icon: "💚", color: "text-green-400" };

  if (techLower.includes("node"))
    return { icon: "🟢", color: "text-green-600" };
  if (techLower.includes("nest")) return { icon: "🐈", color: "text-red-600" };
  if (techLower.includes("java"))
    return { icon: "☕", color: "text-orange-600" };
  if (techLower.includes("python"))
    return { icon: "🐍", color: "text-blue-600" };

  if (techLower.includes("mongo"))
    return { icon: "🍃", color: "text-green-600" };
  if (techLower.includes("postgres"))
    return { icon: "🐘", color: "text-blue-600" };
  if (techLower.includes("mysql"))
    return { icon: "🐬", color: "text-blue-500" };

  return { icon: "🔧", color: "text-gray-500" };
};

import { FileNode } from '../graphql/project';
import { sortBy } from 'lodash-es';

// Extended FileNode interface for tree display with children
export interface TreeFileNode extends Omit<FileNode, 'parentPath'> {
  children?: TreeFileNode[];
  content?: string; // Optional content loaded on demand
}

/**
 * Convert flat file array with path/parentPath to tree structure
 * @param flatFiles - Array of FileNode with path and parentPath
 * @returns Tree structure compatible with FileExplorer
 */
export const buildFileTree = (flatFiles: FileNode[]): TreeFileNode[] => {
  if (!flatFiles || flatFiles.length === 0) return [];

  // Create map for quick lookup
  const fileMap = new Map<string, TreeFileNode>();
  const roots: TreeFileNode[] = [];

  // First pass: create all nodes
  flatFiles.forEach(file => {
    const treeNode: TreeFileNode = {
      name: file.name,
      type: file.type,
      path: file.path,
      language: file.language,
      content: file.content, // Copy content from GraphQL response
      children: []
    };
    fileMap.set(file.path, treeNode);
  });

  // Second pass: build parent-child relationships
  flatFiles.forEach(file => {
    const currentNode = fileMap.get(file.path);
    if (!currentNode) return;

    if (file.parentPath) {
      // Has parent - add to parent's children
      const parentNode = fileMap.get(file.parentPath);
      if (parentNode) {
        if (!parentNode.children) parentNode.children = [];
        parentNode.children.push(currentNode);
      } else {
        // Parent not found, treat as root
        roots.push(currentNode);
      }
    } else {
      // No parent - it's a root node
      roots.push(currentNode);
    }
  });

  // Sort each level: folders first, then files, alphabetically
  const sortNodes = (nodes: TreeFileNode[]): TreeFileNode[] => {
    const sorted = sortBy(nodes, [
      // Folders/directories first
      (node) => node.type === 'folder' || node.type === 'directory' ? 0 : 1,
      // Then alphabetically by name
      'name'
    ]);

    // Recursively sort children
    sorted.forEach(node => {
      if (node.children && node.children.length > 0) {
        node.children = sortNodes(node.children);
      }
    });

    return sorted;
  };

  return sortNodes(roots);
};

/**
 * Find a file node in the tree by path
 * @param tree - Tree structure
 * @param targetPath - Path to find
 * @returns Found node or null
 */
export const findFileInTree = (tree: TreeFileNode[], targetPath: string): TreeFileNode | null => {
  for (const node of tree) {
    if (node.path === targetPath) {
      return node;
    }
    
    if (node.children) {
      const found = findFileInTree(node.children, targetPath);
      if (found) return found;
    }
  }
  
  return null;
};

/**
 * Get all file paths from tree (for preloading)
 * @param tree - Tree structure
 * @param fileOnly - Only return files (not folders)
 * @returns Array of file paths
 */
export const getAllFilePaths = (tree: TreeFileNode[], fileOnly: boolean = true): string[] => {
  const paths: string[] = [];
  
  const traverse = (nodes: TreeFileNode[]) => {
    nodes.forEach(node => {
      const isFile = node.type !== 'folder' && node.type !== 'directory';
      
      if (!fileOnly || isFile) {
        paths.push(node.path);
      }
      
      if (node.children) {
        traverse(node.children);
      }
    });
  };
  
  traverse(tree);
  return paths;
};

/**
 * Update file content in tree
 * @param tree - Tree structure
 * @param filePath - Path of file to update
 * @param content - New content
 * @returns Updated tree
 */
export const updateFileContent = (tree: TreeFileNode[], filePath: string, content: string): TreeFileNode[] => {
  return tree.map(node => {
    if (node.path === filePath) {
      return { ...node, content };
    }
    
    if (node.children) {
      return {
        ...node,
        children: updateFileContent(node.children, filePath, content)
      };
    }
    
    return node;
  });
};
